from flask import Flask, make_response, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import uuid
from bson import ObjectId
from config import DevelopmentConfig
from utils.database import init_db, mongo
from routes.auth import auth_bp
from routes.face_auth import face_auth_bp

app = Flask(__name__)

# Load config
app.config.from_object(DevelopmentConfig)

# Debug output
print(f"MONGO_URI: {app.config.get('MONGO_URI')}")
print(f"JWT_SECRET_KEY: {app.config.get('JWT_SECRET_KEY')}")
print(f"CORS allowing origins: {os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000')}")

# CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
CORS(
    app,
    origins=allowed_origins,
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

# DB
init_db(app)

# Blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(face_auth_bp, url_prefix="/face_auth")

@app.route("/")
def health():
    return {
        "status": "ok",
        "env": app.config.get("ENV", "production"),
        "db": app.config.get("MONGO_DB_NAME"),
    }

# Add OPTIONS handler
@app.before_request
def handle_options():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", request.headers.get("Origin", ""))
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response

# In your app.py, add this route
@app.route("/debug/routes")
def list_routes():
    import urllib
    output = []
    for rule in app.url_map.iter_rules():
        methods = ','.join(rule.methods)
        line = urllib.parse.unquote(f"{rule.endpoint:50} {methods:20} {rule}")
        output.append(line)
    
    return jsonify({"routes": sorted(output)})

# Static admin credentials
ADMIN_CREDENTIALS = {
    "email": "admin@gmail.com",
    "password": "admin"
}

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if email == ADMIN_CREDENTIALS['email'] and password == ADMIN_CREDENTIALS['password']:
        return jsonify({"success": True, "message": "Login successful"})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        users = list(mongo.db.users.find({}, {'password': 0}))  # Exclude password field
        # Convert ObjectId to string for JSON serialization
        for user in users:
            user['_id'] = str(user['_id'])
        return jsonify(users)
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/certificate-requests', methods=['GET'])
def get_certificate_requests():
    try:
        # Get all bus pass applications (these are our certificate requests)
        requests = list(mongo.db.bus_passes.find({}))
        
        # Convert ObjectId to string for JSON serialization
        for req in requests:
            req['_id'] = str(req['_id'])
            req['user_id'] = str(req['user_id'])
            
        return jsonify(requests)
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/approve-request/<request_id>', methods=['POST'])
def approve_request(request_id):
    try:
        # Update the bus pass status to approved and generate a pass code
        pass_code = str(uuid.uuid4())[:8].upper()
        result = mongo.db.bus_passes.update_one(
            {'_id': ObjectId(request_id)},
            {'$set': {'status': 'approved', 'pass_code': pass_code}}
        )
        
        if result.modified_count > 0:
            # Also update user status if needed
            bus_pass = mongo.db.bus_passes.find_one({'_id': ObjectId(request_id)})
            if bus_pass:
                mongo.db.users.update_one(
                    {'_id': ObjectId(bus_pass['user_id'])},
                    {'$set': {'bus_pass_approved': True}}
                )
            
            return jsonify({"success": True, "pass_code": pass_code})
        else:
            return jsonify({"success": False, "message": "Request not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/decline-request/<request_id>', methods=['POST'])
def decline_request(request_id):
    try:
        # Update the bus pass status to declined
        result = mongo.db.bus_passes.update_one(
            {'_id': ObjectId(request_id)},
            {'$set': {'status': 'declined'}}
        )
        
        if result.modified_count > 0:
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "message": "Request not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Serve applicant photos
@app.route('/uploads/applicantPhotos/<filename>')
def serve_applicant_photo(filename):
    # Use the UPLOAD_FOLDER from config instead of hardcoding path
    folder = os.path.join(app.config['UPLOAD_FOLDER'], 'applicantPhotos')
    return send_from_directory(folder, filename)

# Serve study certificates
@app.route('/uploads/studyCertificates/<filename>')
def serve_study_certificate(filename):
    # Use the UPLOAD_FOLDER from config instead of hardcoding path
    folder = os.path.join(app.config['UPLOAD_FOLDER'], 'studyCertificates')
    return send_from_directory(folder, filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=os.getenv("FLASK_DEBUG", "True")=="True")