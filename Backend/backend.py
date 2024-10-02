from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

api_key = os.getenv("API_KEY")
genai.configure(api_key=api_key)


@app.route("/api/generate", methods=["POST"])
def generate_response():
    data = request.json
    user_input = data.get("question")

    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(user_input)
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
