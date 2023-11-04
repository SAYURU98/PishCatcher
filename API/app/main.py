import logging
from fastapi import FastAPI
from pydantic import BaseModel
from joblib import load
from featureExtraction import extract_features
import uvicorn

app = FastAPI()
logger = logging.getLogger("API")
logger.setLevel(logging.INFO)
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
file_handler = logging.FileHandler("logs/api.log")
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# Load the MLP model
mlp_model = load("mlp_model.pkl")

class URL(BaseModel):
    url: str

@app.post("/predict")
def predict_url(url_data: URL):
    url = url_data.url

    logger.info(f"Received URL: {url}")

    # Extract features from the URL
    features = extract_features(url)

    logger.info(f"Extracted features: {features}")

    # Prepare features for prediction
    features_array = [features]

    # Predict using the loaded model
    prediction = mlp_model.predict(features_array)
    i = prediction[0][0] * 100
    i = round(i, 3)

    logger.info(f"Prediction: {i}")

    # Return the prediction value as an integer
    return 1 if i > 59 else 0

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000)
