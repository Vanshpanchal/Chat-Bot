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
    role = data.get("role", "assistant")

    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    try:
        model = genai.GenerativeModel("gemini-pro")

        if role == "expert":
            role_instruction = "You are a knowledgeable expert on the topic. Provide a detailed and professional response."
        elif role == "friend":
            role_instruction = "Hey! I've been thinking about something and could really use your advice. What would you suggest if you were in my shoes? Would love to hear your thoughts, like a friend giving advice on this below topic"
        else:
            role_instruction = (
                "You are an AI assistant. Help the user in a polite and clear manner."
            )
        prompt = f"{role_instruction}\nUser: {user_input}"
        response = model.generate_content(prompt)
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
