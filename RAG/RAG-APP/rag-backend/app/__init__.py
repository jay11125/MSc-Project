from flask import Flask
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_cors import CORS 
from config import Config

mongo = PyMongo()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    mongo.init_app(app)
    jwt.init_app(app)

    from app.auth import auth_bp
    from app.chat import chat_bp
    from app.document import document_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(chat_bp, url_prefix='/chat')
    app.register_blueprint(document_bp, url_prefix='/document')
    
    CORS(app, resources={r"/*": {"origins": "*"}})

    return app
