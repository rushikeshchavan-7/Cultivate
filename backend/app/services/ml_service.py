import io
import pickle
import os
from pathlib import Path

import numpy as np
import pandas as pd
import torch
from torchvision import transforms
from PIL import Image

from ..utils.model import ResNet9
from ..utils.disease_data import disease_dic
from ..utils.fertilizer_data import fertilizer_dic

# Global model references
disease_model = None
crop_model = None
disease_classes = []

BASE_DIR = Path(__file__).resolve().parent.parent

DISEASE_CLASSES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
    "Blueberry___healthy", "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_", "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy", "Grape___Black_rot", "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)", "Peach___Bacterial_spot",
    "Peach___healthy", "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy",
    "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy",
    "Raspberry___healthy", "Soybean___healthy", "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch", "Strawberry___healthy", "Tomato___Bacterial_spot",
    "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot", "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus", "Tomato___healthy",
]


def load_models():
    """Load ML models at startup."""
    global disease_model, crop_model, disease_classes

    disease_classes = DISEASE_CLASSES

    # Load disease classification model
    disease_model_path = BASE_DIR / "ml_models" / "plant_disease_model.pth"
    if disease_model_path.exists():
        disease_model = ResNet9(3, len(disease_classes))
        disease_model.load_state_dict(
            torch.load(str(disease_model_path), map_location=torch.device("cpu"), weights_only=True)
        )
        disease_model.eval()
        print(f"Disease model loaded from {disease_model_path}")
    else:
        print(f"WARNING: Disease model not found at {disease_model_path}")

    # Load crop recommendation model
    crop_model_path = BASE_DIR / "ml_models" / "RandomForest.pkl"
    if crop_model_path.exists():
        with open(crop_model_path, "rb") as f:
            crop_model = pickle.load(f)
        print(f"Crop model loaded from {crop_model_path}")
    else:
        print(f"WARNING: Crop model not found at {crop_model_path}")


def predict_crop(n: int, p: int, k: int, temperature: float, humidity: float, ph: float, rainfall: float) -> str:
    """Predict the best crop based on soil and weather conditions."""
    if crop_model is None:
        raise RuntimeError("Crop recommendation model not loaded")
    data = pd.DataFrame([[n, p, k, temperature, humidity, ph, rainfall]],
                        columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
    prediction = crop_model.predict(data)
    return prediction[0]


def predict_disease(image_bytes: bytes) -> dict:
    """Predict plant disease from image bytes."""
    if disease_model is None:
        raise RuntimeError("Disease classification model not loaded")

    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.ToTensor(),
    ])
    image = Image.open(io.BytesIO(image_bytes))
    img_t = transform(image)
    img_u = torch.unsqueeze(img_t, 0)

    with torch.no_grad():
        yb = disease_model(img_u)
    _, preds = torch.max(yb, dim=1)
    prediction_key = disease_classes[preds[0].item()]

    disease_info = disease_dic.get(prediction_key, {
        "crop": "Unknown",
        "disease": prediction_key,
        "cause": "",
        "prevention": [],
    })

    return {
        "prediction_key": prediction_key,
        "crop": disease_info["crop"],
        "disease": disease_info["disease"],
        "cause": disease_info["cause"],
        "prevention": disease_info["prevention"],
    }


def predict_fertilizer(crop_name: str, n: int, p: int, k: int) -> dict:
    """Predict fertilizer recommendation based on soil NPK and crop needs."""
    data_path = BASE_DIR / "data" / "fertilizer.csv"
    df = pd.read_csv(data_path)

    crop_row = df[df["Crop"] == crop_name]
    if crop_row.empty:
        raise ValueError(f"Crop '{crop_name}' not found in fertilizer database")

    nr = int(crop_row["N"].iloc[0])
    pr = int(crop_row["P"].iloc[0])
    kr = int(crop_row["K"].iloc[0])

    n_diff = nr - n
    p_diff = pr - p
    k_diff = kr - k

    temp = {abs(n_diff): "N", abs(p_diff): "P", abs(k_diff): "K"}
    max_value = temp[max(temp.keys())]

    if max_value == "N":
        key = "NHigh" if n_diff < 0 else "Nlow"
    elif max_value == "P":
        key = "PHigh" if p_diff < 0 else "Plow"
    else:
        key = "KHigh" if k_diff < 0 else "Klow"

    fert_info = fertilizer_dic.get(key, {
        "condition": "Unknown condition",
        "suggestions": [],
    })

    return {
        "key": key,
        "condition": fert_info["condition"],
        "suggestions": fert_info["suggestions"],
        "analysis": {
            "nitrogen": {"required": nr, "provided": n, "difference": n_diff},
            "phosphorous": {"required": pr, "provided": p, "difference": p_diff},
            "potassium": {"required": kr, "provided": k, "difference": k_diff},
        },
    }
