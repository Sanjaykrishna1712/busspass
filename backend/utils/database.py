# backend/utils/database.py
from flask_pymongo import PyMongo
from pymongo import ASCENDING

mongo = PyMongo()

def init_db(app):
    if not app.config.get("MONGO_URI"):
        raise RuntimeError("MONGO_URI missing in app.config")

    mongo.init_app(app)
    with app.app_context():
        db = mongo.db
        db.command("ping")
        print(f"✅ Connected to MongoDB: {db.name}")

        # Indexes
        db.users.create_index([("email", ASCENDING)], unique=True)
        db.users.create_index([("face_registered", ASCENDING)])
        db.users.create_index([("user_type", ASCENDING)])

        db.bus_passes.create_index([("user_id", ASCENDING)])
        db.bus_passes.create_index([("status", ASCENDING)])
        db.bus_passes.create_index([("expiry_date", ASCENDING)])
