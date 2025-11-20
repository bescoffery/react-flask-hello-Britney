"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/signup', methods=['POST', 'GET'])
def create_user():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400
    

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already exists"}), 409
    
    new_user = User(email=email)
    try:
        new_user.set_password(password) # This method must be in your User model
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "User created successfully. Please log in."}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"An error occurred during creation: {str(e)}"}), 500

@api.route("/token", methods=["POST"])
def create_token():
    """Handles user authentication (Login) and returns a JWT."""
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email).first()

    if user is None or not user.check_password(password):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=user.id)
    response = jsonify(access_token=access_token)
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'

    return response


@api.route("/private", methods=["GET"])
@jwt_required()
def private_endpoint():
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)
    return jsonify({
        "message": f"Hello {user.email}, you are authenticated and can access this private data!",
        "user_id": current_user_id,
        "is_authenticated": True
    }), 200

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200