CROP_FERTILIZER_PLAN = {
    "wheat": {
        "sowing":    {"urea": 30, "dap": 50, "potash": 25},
        "tillering": {"urea": 40, "dap": 0,  "potash": 0},
        "heading":   {"urea": 30, "dap": 0,  "potash": 0},
    },
    "rice": {
        "sowing":    {"urea": 25, "dap": 50, "potash": 30},
        "tillering": {"urea": 50, "dap": 0,  "potash": 0},
        "flowering": {"urea": 25, "dap": 0,  "potash": 25},
    },
    "cotton": {
        "sowing":    {"urea": 30, "dap": 60, "potash": 30},
        "vegetative":{"urea": 50, "dap": 0,  "potash": 0},
        "boll":      {"urea": 40, "dap": 0,  "potash": 30},
    },
    "maize": {
        "sowing":    {"urea": 35, "dap": 55, "potash": 25},
        "vegetative":{"urea": 55, "dap": 0,  "potash": 0},
        "tasseling": {"urea": 35, "dap": 0,  "potash": 0},
    },
    "sugarcane": {
        "sowing":    {"urea": 50, "dap": 70, "potash": 50},
        "tillering": {"urea": 70, "dap": 0,  "potash": 0},
        "grand_growth":{"urea":50, "dap": 0, "potash": 30},
    },
    "tomato": {
        "sowing":    {"urea": 20, "dap": 40, "potash": 20},
        "flowering": {"urea": 30, "dap": 0,  "potash": 25},
        "fruiting":  {"urea": 20, "dap": 0,  "potash": 30},
    },
    "potato": {
        "sowing":    {"urea": 25, "dap": 50, "potash": 40},
        "tuber_init":{"urea": 35, "dap": 0,  "potash": 20},
        "bulking":   {"urea": 25, "dap": 0,  "potash": 25},
    },
}

DISEASE_ADJUSTMENT = {
    "nitrogen_deficiency": {"urea": +20},
    "phosphorus_deficiency":{"dap": +15},
    "healthy": {},
}

def get_fertilizer_advice(
    crop: str,
    stage: str,
    area_acres: float = 1.0,
    disease_status: str = "healthy"
) -> dict:

    crop = crop.lower()
    stage = stage.lower()
    disease_status = disease_status.lower()

    if crop not in CROP_FERTILIZER_PLAN:
        return {"error": f"Crop '{crop}' not supported"}

    stages = CROP_FERTILIZER_PLAN[crop]
    if stage not in stages:
        available = list(stages.keys())
        return {
            "error": f"Stage '{stage}' not valid for {crop}",
            "available_stages": available
        }

    base = stages[stage].copy()

    # apply disease adjustment
    adjustment = DISEASE_ADJUSTMENT.get(disease_status, {})
    for fert, delta in adjustment.items():
        if fert in base:
            base[fert] = max(0, base[fert] + delta)

    # scale by area
    scaled = {k: round(v * area_acres, 1) for k, v in base.items()}

    # build response
    primary_fert = max(scaled.items(), key=lambda x: x[1])[0].upper() if scaled else "NPK"
    total_qty = sum(scaled.values())

    return {
        "type": primary_fert,
        "quantity": round(total_qty, 1),
        "timing": "Subah ya sham apply karo, pani ke baad",
        "crop": crop,
        "stage": stage,
        "area_acres": area_acres,
        "fertilizer_breakdown": scaled,
        "disease_status": disease_status
    }