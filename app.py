import streamlit as st
from dotenv import load_dotenv
from pypdf import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter #controllare se meglio questo
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from htmlTemplates import css, bot_template, user_template

# FAISS è un database come pinecone o firebase e gira localmente, quindi quando chiudi si cancella tutto
# streamlit e oggetto st si occupano di parte grafica
# dotenv si occupa della funzione che permette al tuo main di usare .env
from langchain.memory import ConversationBufferMemory  # libreria memoria
from langchain.chains import ConversationalRetrievalChain  # permette di chattare
from langchain.vectorstores import Chroma




def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
        pdf_reader = PdfReader(pdf) 
        for page in pdf_reader.pages:
            text += page.extract_text()  # estrae il testo raw dal pdf
        return text
    # da min 19:50 a min 24:40


def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(  # metodo spezza-testo
        separator="\n",
        chunk_size=1000,  # grandezza chunck
        chunk_overlap=200,  # Spazio di sicurezza, così non spezzi la frase male
        length_function=len,
    )
    chunks = text_splitter.split_text(text)  # ritorna lista di testi spezzati
    return chunks
    # da min 24:50 a 29:30


def get_vectorstore(text_chunks):
    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    return vectorstore
    # 32:20 a 36:20
    # embedding hugging 36:25 to 41:00
    # LLM hugginface 1:02:10


def get_conversation_chain(vectorstore):
    llm = ChatOpenAI()
    memory = ConversationBufferMemory(
        memory_key="chat_history", return_messages=True
    )  # istanza memoria
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm, retriever=vectorstore.as_retriever(), memory=memory
    )
    return conversation_chain


# da 41:00 a 46:00


def handle_userinput(user_question):
    response = st.session_state.conversation({"question": user_question})
    st.write(response)
    st.session_state.chat_history = response["chat_history"]

    for i, message in enumerate(
        st.session_state.chat_history
    ):  # questo loopa attraverso la char history e fa vedere solo il content
        if i % 2 == 0:
            st.write(
                user_template.replace("{{MSG}}", message.content),
                unsafe_allow_html=True,
            )  # domanda utente
        else:
            st.write(
                bot_template.replace("{{MSG}}", message.content), unsafe_allow_html=True
            )


def main():
    load_dotenv()
    st.set_page_config(page_title="Chat with PDFs", page_icon=":books:")
    st.write(css, unsafe_allow_html=True)

    # inizializzazione conversazione e storia
    if "conversation" not in st.session_state:
        st.session_state.conversation = None
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = None

    st.header("Chat with your PDFs")
    user_question = st.text_input("Ask me a question about your documents")
    if user_question:
        handle_userinput(
            user_question
        )  # quando lo user fa una domanda, funzione si attiva

    with st.sidebar:
        st.subheader("Your document")
        pdf_docs = st.file_uploader(
            "Upload your PDFs here and click on 'Process'", accept_multiple_files=True, type=["txt","pdf"] 
        )
        if st.button("Process"):  # quando viene cliccato
            with st.spinner(
                "Processing"
            ):  # spinner serve per dire a client che sta lavorando, non è freezato
                # prende il testo pdf
                raw_text = get_pdf_text(pdf_docs)
                # prende il testo spezzettato
                text_chunks = get_text_chunks(raw_text)
                st.write(text_chunks)
                # crea il vettore
                vectorstore = get_vectorstore(text_chunks)

                # crea catena conversazione
                st.session_state.conversation = get_conversation_chain(
                    vectorstore
                )  # prende la storia della conversazione e ritorna il prossimo elemento
                # streamlist tende a ricaricarsi ogni volta che premi un bottone, cosi a caso
                # st.session_state dice che "ehy, non rinizializzare questa var"
                # st.session_state.conversation  esiste fuori da questo scope


if __name__ == "__main__":
    main()
