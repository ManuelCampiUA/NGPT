from django.shortcuts import render
from django.http import JsonResponse
from pypdf import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain


def home(request):
    return render(request, "DjangoPDF/index.html")


def test(request):
    return render(request, "DjangoPDF/test.html")


def ajax_QeA(request):
    if (
        request.headers.get("x-requested-with") == "XMLHttpRequest"
        and request.method == "POST"
    ):
        pdfs = "test/PDFs/INSDG4457-20.pdf", ""
        raw_text = get_pdf_text(pdfs)
        text_chunks = get_text_chunks(raw_text)
        vectorstore = get_vectorstore(text_chunks)
        conversation_chain = get_conversation_chain(vectorstore)
        user_question = request.POST["question"]
        data = {"response": conversation_chain.run(question=user_question)}
        return JsonResponse(data)


def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
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
    persist_directory = "test/chromaDB"
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
