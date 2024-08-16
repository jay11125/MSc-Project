def test_upload_document(test_client, access_token):
    headers = {'Authorization': f'Bearer {access_token}'}
    data = {'file': (open('tests/test_file.pdf', 'rb'), 'test_file.pdf')}
    response = test_client.post('/document/upload', headers=headers, content_type='multipart/form-data', data=data)
    assert response.status_code == 201
    assert 'chat_id' in response.json
    assert 'file_name' in response.json
    assert 'history' in response.json

def test_upload_invalid_document(test_client, access_token):
    headers = {'Authorization': f'Bearer {access_token}'}
    data = {'file': (open('tests/invalid_file.docx', 'rb'), 'invalid_file.docx')}
    response = test_client.post('/document/upload', headers=headers, content_type='multipart/form-data', data=data)
    assert response.status_code == 400
    assert response.json['msg'] == "Invalid file format"
