from pypdf import PdfReader 

def process_document(file, filename):
    if filename.endswith('.pdf'):
        # For PDF files, use PyPDF2 to read the file content
        pdf_reader = PdfReader(file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
    elif filename.endswith('.txt'):
        # For text files, read the content directly
        text = file.read().decode('utf-8')
    else:
        raise ValueError("Unsupported file format")
    
    return text