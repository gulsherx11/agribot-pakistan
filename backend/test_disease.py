from agents.disease_agent import predict_disease
from PIL import Image
import io

# Create a simple test image
img = Image.new('RGB', (224, 224), color='green')
img_bytes = io.BytesIO()
img.save(img_bytes, format='PNG')
img_bytes.seek(0)

try:
    result = predict_disease(img_bytes.getvalue())
    print("Success! Result:", result)
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
