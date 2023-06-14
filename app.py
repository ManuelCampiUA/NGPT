import os
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
from langchain.callbacks import get_openai_callback


def get_pdf_text(pdf_path):
    text = ""
    pdf_reader = PdfReader(pdf_path)
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text


def get_text_chunks(text):
    text_splitter = CharacterTextSplitter(
        separator="\n", chunk_size=1000, chunk_overlap=200, length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks


def get_vectorstore(text_chunks):
    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    return vectorstore


def get_conversation_chain():
    llm = OpenAI()
    conversation_chain = load_qa_chain(llm, chain_type="stuff")
    return conversation_chain


def main():
    load_dotenv()
    raw_text = get_pdf_text("INSDG4457-20.pdf")
    text_chunks = get_text_chunks(raw_text)
    vectorstore = get_vectorstore(text_chunks)
    conversation_chain = get_conversation_chain()
    while True:
        user_question = input("Ask a question about your documents: ")
        if user_question.lower() == "exit":
            break

        docs = vectorstore.similarity_search(user_question)
        with get_openai_callback() as cb: ##
            response = conversation_chain.run(input_documents=docs, question=user_question)
            print(cb) ##

        print(response) ##


if __name__ == "__main__":
    main()
