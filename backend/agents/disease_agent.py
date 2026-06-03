import torch
import timm
import json
from torchvision import transforms
from PIL import Image
import io
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

# Initialize Groq client for treatment advice
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

BASE_DIR   = os.path.dirname(os.path.dirname(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "disease_model.pth")
LABELS_PATH= os.path.join(BASE_DIR, "models", "class_labels.json")

# ── load once at startup ──
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

with open(LABELS_PATH) as f:
    CLASS_LABELS = json.load(f)

NUM_CLASSES = len(CLASS_LABELS)

model = timm.create_model(
    "efficientnet_b3",
    pretrained=False,
    num_classes=NUM_CLASSES,
    drop_rate=0.3,
    drop_path_rate=0.2
)
model.load_state_dict(
    torch.load(MODEL_PATH, map_location=device)
)
model.eval()
model.to(device)

# ── normalize duplicate labels ──
LABEL_MERGE = {
    # tomato duplicates
    "tomato__tomato_mosaic_virus":                   "tomato_mosaic_virus",
    "tomato__tomato_yellowleaf__curl_virus":          "tomato_yellow_leaf_curl",
    "tomato_spider_mites_two_spotted_spider_mite":    "tomato_spider_mites",
    "tomato__target_spot":                            "tomato_target_spot",
    # pepper duplicates
    "pepper__bell___bacterial_spot":                  "pepper_bacterial_spot",
    "pepper__bell___healthy":                         "pepper_healthy",
    # others
    "soyabean_leaf":                                  "soybean_healthy",
}

SEVERITY_MAP = {
    "blight":  "high",
    "rust":    "high",
    "spot":    "medium",
    "mildew":  "medium",
    "scab":    "medium",
    "virus":   "high",
    "mold":    "medium",
    "healthy": "none",
}

transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

def predict_disease(image_bytes: bytes) -> dict:
    img    = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(tensor)
        probs   = torch.softmax(outputs, dim=1)
        conf, idx = probs.max(1)

    raw_label  = CLASS_LABELS[idx.item()]
    label      = LABEL_MERGE.get(raw_label, raw_label)
    confidence = round(conf.item() * 100, 1)

    # parse crop + condition
    parts     = label.split("_")
    crop      = parts[0]
    condition = "_".join(parts[1:]) if len(parts) > 1 else "unknown"

    # severity
    severity = "low"
    for key, sev in SEVERITY_MAP.items():
        if key in condition:
            severity = sev
            break

    return {
        "disease":    condition.replace("_", " "),
        "confidence": confidence / 100,
        "severity":   severity,
        "crop":       crop,
        "raw_label":  raw_label
    }

def get_treatment(crop: str, disease: str, severity: str) -> str:
    """Generate treatment advice using LLM in English and Urdu"""
    try:
        prompt = f"""You are an expert agricultural advisor for Pakistani farmers.
A farmer's {crop} plant has been detected with: {disease} (Severity: {severity})

Provide treatment and prevention advice in BOTH languages:
1. First provide advice in ENGLISH
2. Then provide the same advice in URDU (using proper Urdu script, not Roman Urdu)

Format:
🌾 ENGLISH:
[Advice here in English]

🌾 اردو:
[Advice here in proper Urdu script]

Keep it practical and actionable. Focus on:
- Immediate treatment steps
- Preventive measures
- When to consult an expert

Keep response to 3-4 sentences per language maximum."""

        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.3
        )
        
        treatment = response.choices[0].message.content
        return treatment
    except Exception as e:
        # Log error without exposing sensitive details
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Treatment generation error: {type(e).__name__}")
        # Fallback treatment if LLM fails
        return """🌾 ENGLISH:
Please consult an expert or local agricultural officer for proper treatment guidance.

🌾 اردو:
براہ کرم کسی ماہر یا مقامی زرعی افسر سے رابطہ کریں۔"""