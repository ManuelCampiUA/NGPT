from flask import Blueprint, render_template, request
from os import listdir, path
from werkzeug.utils import secure_filename
from .auth import login_required
from .functions import upload_AI, allowed_file, get_conversation_chain

FILE_FOLDER = "upload"

main = Blueprint("main", __name__)


@main.route("/")
@login_required
def home():
    file_list = {}
    for file in listdir(FILE_FOLDER):
        size = round(path.getsize(path.join(FILE_FOLDER, file)) / 1000000, 3)
        file_list[file] = str(size) + " MB"
    return render_template("index.html", file_list=file_list)


@main.post("/upload")
@login_required
def upload():
    file_uploaded = []
    if "file_0" not in request.files:
        return {"response": "No selected file"}
    files = request.files
    for file in files:
        if allowed_file(files[file].filename):
            secure_file_name = secure_filename(files[file].filename)
            file_path = path.join(FILE_FOLDER, secure_file_name)
            files[file].save(file_path)
            file_uploaded.append(file_path)
    if file_uploaded:
        upload_AI(file_uploaded)
        data = {"response": "Success"}
        return data
    data = {"response": "Error"}
    return data


@main.get("/file_list")
@login_required
def file_list():
    file_list = {}
    for file in listdir(FILE_FOLDER):
        size = round(path.getsize(path.join(FILE_FOLDER, file)) / 1000000, 3)
        file_list[file] = str(size) + " MB"
    data = {"response": file_list}
    return data


@main.post("/QeA")
@login_required
def QeA():
    if listdir(FILE_FOLDER):
        user_question = request.form["question"]
        data = {"response": get_conversation_chain().run(question=user_question)}
        return data
    data = {"response": False}
    return data
