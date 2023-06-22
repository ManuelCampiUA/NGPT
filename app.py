import os
from flask import Flask, request, render_template
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from pypdf import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain

UPLOAD_FOLDER = "upload"
ALLOWED_EXTENSIONS = {"pdf"}

app = Flask(__name__)
load_dotenv()


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/test")
def test():
    return render_template("test.html")


@app.post("/upload")
def upload():
    file = request.files["file"]
    if file and allowed_file(file.filename):
        files = request.files.getlist("file")
        for file in files:
            file.save(f"{UPLOAD_FOLDER}/{secure_filename(file.filename)}")
        return "Success", 200
    return "Error", 500


@app.post("/QeA")
def QeA():
    raw_text = get_pdf_text(UPLOAD_FOLDER)
    text_chunks = get_text_chunks(raw_text)
    vectorstore = get_vectorstore(text_chunks)
    conversation_chain = get_conversation_chain(vectorstore)
    user_question = request.json["question"]
    data = {"response": conversation_chain.run(question=user_question)}
    return data


def get_pdf_text(pdf_docs):
    text = ""
    for pdf in os.listdir(pdf_docs):
        pdf_reader = PdfReader(os.path.join(pdf_docs, pdf))
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text


def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(
        separators=[",", ".", "\n", ";"],
        keep_separator=True,
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    chunks = text_splitter.split_text(text)
    return chunks


def get_vectorstore(text_chunks):
    persist_directory = "test/Chromadb"
    embeddings = OpenAIEmbeddings()
    vectorstore = Chroma.from_texts(
        text_chunks, embeddings, persist_directory=persist_directory
    )
    vectorstore.persist()
    vectorstore = Chroma(
        persist_directory=persist_directory, embedding_function=embeddings
    )
    return vectorstore


def get_conversation_chain(vectorstore):
    llm = ChatOpenAI()
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm, retriever=vectorstore.as_retriever(), memory=memory
    )
    return conversation_chain
