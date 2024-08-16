from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import mongo
from app.utils import process_document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from app.rag import embeddings
import uuid

document_bp = Blueprint('document', __name__)

@document_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload():
    user_email = get_jwt_identity()
    if 'file' not in request.files:
        return jsonify({"msg": "No file part"}), 400

    file = request.files['file']
    filename = file.filename
    if filename == '':
        return jsonify({"msg": "No selected file"}), 400

    if filename.endswith('.pdf') or filename.endswith('.txt'):
        text = process_document(file, filename)

        # Split the document into chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1024, chunk_overlap=256)
        texts = text_splitter.split_text(text)

        # Create a unique chat ID
        chat_id = str(uuid.uuid4())

        # Save chat context and history in MongoDB
        mongo.db.chats.insert_one({
            "user_email": user_email,
            "chat_id": chat_id,
            "file_name": file.filename,
            "context": texts,
            "history": []
        })

        return jsonify({"chat_id": chat_id, "file_name":file.filename, "history": []}), 201

    return jsonify({"msg": "Invalid file format"}), 400
