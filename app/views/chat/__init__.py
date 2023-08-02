from flask import Blueprint, render_template, request
from os import listdir, path
from werkzeug.utils import secure_filename
from openai import error
from ..auth import login_required
from .utils import load_AI, upload_AI, allowed_file

FILE_FOLDER = "upload"

chat_views = Blueprint("chat_views", __name__)


@chat_views.route("/chat")
@login_required
def chat():
    file_list = {}
    if listdir(FILE_FOLDER):
        global conversation_chain
        conversation_chain = load_AI()
        for file in listdir(FILE_FOLDER):
            size = round(path.getsize(path.join(FILE_FOLDER, file)) / 1000000, 3)
            file_list[file] = str(size) + " MB"
    return render_template("chat.html", file_list=file_list)


@chat_views.post("/upload")
@login_required
def upload():
    file_uploaded = []
    if "file_0" not in request.files:
        return {"response": "No selected file"}, 400
    files = request.files
    for file in files:
        if allowed_file(files[file].filename):
            secure_file_name = secure_filename(files[file].filename)
            file_path = path.join(FILE_FOLDER, secure_file_name)
            files[file].save(file_path)
            file_uploaded.append(file_path)
    if file_uploaded:
        global conversation_chain
        conversation_chain = upload_AI(file_uploaded)
        data = {"response": "Success"}
        return data
    data = {"response": "Incorrect file extension"}, 400
    return data


@chat_views.get("/file_list")
@login_required
def file_list():
    file_list = {}
    for file in listdir(FILE_FOLDER):
        size = round(path.getsize(path.join(FILE_FOLDER, file)) / 1000000, 3)
        file_list[file] = str(size) + " MB"
    data = {"response": file_list}
    return data


@chat_views.post("/QeA")
@login_required
def QeA():
    try:
        if listdir(FILE_FOLDER):
            user_question = request.form["question"]
            data = {
                "response": conversation_chain.run(question=user_question)}
            return data
        data = {"response": "No file uploaded"}, 400
        return data
    except error.AuthenticationError:
        return {"response": "Wrong API Key"}, 400
