from sentence_transformers import CrossEncoder
from langchain_core.retrievers import BaseRetriever
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import FAISS
from langchain_community.llms import LlamaCpp
from huggingface_hub import hf_hub_download
from langchain_community.embeddings import SentenceTransformerEmbeddings

model_name = "SanctumAI/Meta-Llama-3-8B-Instruct-GGUF"
model_basename = "meta-llama-3-8b-instruct.f16.gguf"

model_path = hf_hub_download(repo_id=model_name, filename=model_basename)

llm = LlamaCpp(model_path=model_path, 
               n_ctx=4096,
               n_gpu_layers=-1,
               n_batch=4096,
               temperature=0.0001,)

embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L12-v2")

# Set up Re-Ranker
reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-12-v2')

class ReRankRetriever(BaseRetriever):
    vectorstore:FAISS
    
    def _get_relevant_documents(self, query):
        retrieved_docs = self.vectorstore.as_retriever(search_kwargs={"k": 10}).invoke(query)
        inputs = [(query, doc.page_content) for doc in retrieved_docs]
        # Get the scores from the reranker
        scores = reranker.predict(inputs)
        # Sort documents by scores in descending order
        sorted_docs = [doc for _, doc in sorted(zip(scores, retrieved_docs), key=lambda x: x[0], reverse=True)]
        return sorted_docs[:3]


prompt_template = """Answer the given question from the context provided.

Context:
{context}

Question:
{question}

Strictly return the answer which must not be repetitive.
If you cannot answer the question from given context then don't try to make up an answer.

Answer:"""

prompt = PromptTemplate(
 template=prompt_template, input_variables=["context", "question"]
)

def query_system(chunked_text, query_text):
    vectorstore = FAISS.from_texts(chunked_text, embeddings)
    rerank_retriever = ReRankRetriever(vectorstore=vectorstore)

    qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=rerank_retriever,
    chain_type="stuff",
    chain_type_kwargs={"prompt": prompt})

    result = qa_chain.invoke(query_text)
    answer = result['result']
    return answer