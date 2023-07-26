from flask import Blueprint, session, render_template, request
from os import listdir, path
from werkzeug.utils import secure_filename
from .auth import login_required
from .functions import load_AI, upload_AI, allowed_file

FILE_FOLDER = "upload"

index = Blueprint("index", __name__)


@index.route("/")
@login_required
def home():
    file_list = {}
    if listdir(FILE_FOLDER):
        global conversation_chain
        conversation_chain = load_AI()
        for file in listdir(FILE_FOLDER):
            size = round(path.getsize(path.join(FILE_FOLDER, file)) / 1000000, 3)
            file_list[file] = str(size) + " MB"
    return render_template("index.html", file_list=file_list)


@index.route("/settings")
@login_required
def settings():
    return render_template("settings.html")


@index.post("/upload")
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


@index.get("/file_list")
@login_required
def file_list():
    file_list = {}
    for file in listdir(FILE_FOLDER):
        size = round(path.getsize(path.join(FILE_FOLDER, file)) / 1000000, 3)
        file_list[file] = str(size) + " MB"
    data = {"response": file_list}
    return data


@index.post("/QeA")
@login_required
def QeA():
    if listdir(FILE_FOLDER):
        user_question = request.form["question"]
        conversation_chain = session.get("conversation_chain")
        data = {"response": conversation_chain.run(question=user_question)}
        return data
    data = {"response": "No file uploaded"}, 400
    return data
