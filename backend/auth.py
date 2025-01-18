from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # To allow requests from the React frontend

# In-memory database for demo purposes
users_db = {}

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Check if email or password is missing
    if not email or not password:
        return jsonify({"message": "Email and password are required!"}), 400

    if email in users_db:
        return jsonify({"message": "Email already exists. Please login."}), 400

    users_db[email] = password
    return jsonify({"message": "Signup successful!"}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Check if email or password is missing
    if not email or not password:
        return jsonify({"message": "Email and password are required!"}), 400

    if email not in users_db or users_db[email] != password:
        return jsonify({"message": "Invalid email or password!"}), 401

    return jsonify({"message": "Login successful!"}), 200

if __name__ == '__main__':
    app.run(debug=True)
