def test_create_chat(test_client, access_token, test_chat_id):
    headers = {'Authorization': f'Bearer {access_token}'}
    data = {'file': (open('tests/test_file.pdf', 'rb'), 'test_file.pdf')}
    response = test_client.post('/document/upload', headers=headers, content_type='multipart/form-data', data=data)
    test_chat_id['value'] = response.json['chat_id']
    assert response.status_code == 201
    assert 'chat_id' in response.json
    assert 'file_name' in response.json
    assert 'history' in response.json

def test_list_chats(test_client, access_token):
    headers = {'Authorization': f'Bearer {access_token}'}
    response = test_client.get('/chat/list', headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_query_chat(test_client, access_token,test_chat_id):
    headers = {'Authorization': f'Bearer {access_token}'}
    data = {'chat_id':test_chat_id['value'],'query': 'What is the title of the contract?'}
    response = test_client.post('/chat/query', headers=headers, json=data)
    assert response.status_code == 200
    assert 'answer' in response.json

def test_delete_chat(test_client, access_token, test_chat_id):
    headers = {'Authorization': f'Bearer {access_token}'}
    response = test_client.get('/chat/delete', headers=headers)
    response = test_client.delete('/chat/delete', headers=headers, json={'chat_id': test_chat_id['value']})
    assert response.status_code == 200
    assert response.json['msg'] == "Chat deleted successfully"
