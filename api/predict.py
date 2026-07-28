from http.server import BaseHTTPRequestHandler
import json
import os
import joblib
import pandas as pd

MODEL_PATH = os.path.join(os.path.dirname(__file__), "house_price_model.pkl")
FEATURES_PATH = os.path.join(os.path.dirname(__file__), "feature_names.pkl")

model = joblib.load(MODEL_PATH)
feature_names = joblib.load(FEATURES_PATH)


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)
        data = json.loads(body)

        try:
            input_df = pd.DataFrame([data])
            input_df = pd.get_dummies(input_df)
            input_df = input_df.reindex(columns=feature_names, fill_value=0)

            prediction = model.predict(input_df)[0]

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(
                json.dumps({"predicted_price": round(float(prediction), 2)}).encode()
            )
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
