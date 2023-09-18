from flask import Blueprint, render_template, request
from os import listdir, path, remove
from werkzeug.utils import secure_filename
from openai import error
from ..auth import login_required
from .utils import load_AI, upload_AI, allowed_file, reset_AI

FILES_FOLDER = "upload"

chat_views = Blueprint("chat_views", __name__)


@chat_views.route("/chat")
@login_required
def chat():
    if listdir(FILES_FOLDER):
        global conversation_chain
        conversation_chain = load_AI()
    return render_template("chat.html")


@chat_views.post("/upload")
@login_required
def upload():
    file_uploaded = []
    if "file_0" not in request.files:
        data = {"response": "No selected file"}
        return data, 400
    files = request.files
    for file in files:
        if allowed_file(files[file].filename):
            secure_file_name = secure_filename(files[file].filename)
            file_path = path.join(FILES_FOLDER, secure_file_name)
            files[file].save(file_path)
            file_uploaded.append(file_path)
    if file_uploaded:
        global conversation_chain
        conversation_chain = upload_AI(file_uploaded)
        data = {"response": "Success"}
        return data
    data = {"response": "Incorrect file extension"}
    return data, 400


@chat_views.get("/file_list")
@login_required
def file_list():
    file_list = {}
    for file in listdir(FILES_FOLDER):
        size = round(path.getsize(path.join(FILES_FOLDER, file)) / 1000000, 3)
        file_list[file] = str(size) + " MB"
    data = {"response": file_list}
    return data


@chat_views.delete("/delete")
@login_required
def delete_file():
    file = request.get_json()["fileName"]
    remove(path.join(FILES_FOLDER, file))
    global conversation_chain
    conversation_chain = reset_AI(FILES_FOLDER)
    data = {"response": "Success"}
    return data


@chat_views.post("/QeA")
@login_required
def QeA():
    try:
        if listdir(FILES_FOLDER):
            user_question = request.form["question"]
            data = {"response": conversation_chain.run(question=user_question)}
            return data
        data = {"response": "No file uploaded"}
        return data, 400
    except error.AuthenticationError:
        data = {"response": "Wrong API Key"}
        return data, 400
