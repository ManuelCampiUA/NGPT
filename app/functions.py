import os
from pypdf import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain

FILE_FOLDER = "app/upload"
CHROMADB_FOLDER = "app/chromadb"
ALLOWED_EXTENSIONS = {"pdf"}


def load_AI():
    raw_text = get_pdf_text(FILE_FOLDER)
    text_chunks = get_text_chunks(raw_text)
    vectorstore = get_vectorstore(text_chunks)
    set_conversation_chain(vectorstore)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


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
    embeddings = OpenAIEmbeddings()
    vectorstore = Chroma.from_texts(
        text_chunks, embeddings, persist_directory=CHROMADB_FOLDER
    )
    vectorstore.persist()
    vectorstore = Chroma(
        persist_directory=CHROMADB_FOLDER, embedding_function=embeddings
    )
    return vectorstore


def set_conversation_chain(vectorstore):
    global conversation_chain
    llm = ChatOpenAI()
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm, retriever=vectorstore.as_retriever(), memory=memory
    )


def get_conversation_chain():
    return conversation_chain
