from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import mongo
from app.rag import query_system

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/list', methods=['GET'])
@jwt_required()
def list_chats():
    user_email = get_jwt_identity()
    chats = mongo.db.chats.find({"user_email": user_email}, {"_id": 0, "chat_id": 1, "file_name": 1, "history": 1})
    return jsonify(list(chats)), 200

@chat_bp.route('/<string:chat_id>', methods=['GET'])
@jwt_required()
def get_chat(chat_id):
    user_email = get_jwt_identity()
    chat = mongo.db.chats.find_one({"chat_id": chat_id, "user_email":user_email}, {"_id": 0, "chat_id": 1, "file_name": 1, "history": 1})
    return jsonify(chat), 200

@chat_bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_chat():
    user_email = get_jwt_identity()
    data = request.get_json()
    chat_id = data.get('chat_id')
    if not chat_id:
        return jsonify({"msg": "Chat ID is required"}), 400

    result = mongo.db.chats.delete_one({"chat_id": chat_id, "user_email": user_email})

    if result.deleted_count == 1:
        return jsonify({"msg": "Chat deleted successfully"}), 200
    else:
        return jsonify({"msg": "Chat not found"}), 404

@chat_bp.route('/query', methods=['POST'])
@jwt_required()
def query():
    user_email = get_jwt_identity()
    data = request.get_json()
    chat_id = data.get('chat_id')
    query_text = data.get('query')

    if not chat_id or not query_text:
        return jsonify({"msg": "Chat ID and query are required"}), 400

    chat = mongo.db.chats.find_one({"chat_id": chat_id, "user_email": user_email})
    if not chat:
        return jsonify({"msg": "Chat not found"}), 404

    # Get response from the conversation chain
    answer = query_system(chat["context"], query_text)

    # Update chat history in MongoDB
    mongo.db.chats.update_one(
        {"chat_id": chat_id},
        {"$push": {"history": {"query": query_text, "answer": answer}}}
    )

    return jsonify({"answer": answer}), 200
