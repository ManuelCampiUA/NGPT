import os
from flask import Blueprint, render_template, request
from werkzeug.utils import secure_filename
from .functions import FILE_FOLDER, load_AI, allowed_file, get_conversation_chain

main = Blueprint("main", __name__)


@main.route("/")
def home():
    return render_template("index.html")


@main.route("/test")
def test():
    if os.listdir(FILE_FOLDER):
        load_AI()
    files = os.listdir(FILE_FOLDER)
    return render_template("test.html", files=files)


@main.post("/upload")
def upload():
    file_uploaded = False
    if "file_0" not in request.files:
        return {"response": "No selected file"}
    files = request.files
    for file in files:
        if allowed_file(files[file].filename):
            files[file].save(f"{FILE_FOLDER}/{secure_filename(files[file].filename)}")
            file_uploaded = True
    if file_uploaded:
        data = {"response": "Success"}
        return data
    data = {"response": "Error"}
    return data


@main.get("/get_file_list")
def get_file_list():
    files = os.listdir(FILE_FOLDER)
    data = {"response": files}
    return data


@main.get("/process")
def process():
    load_AI()
    data = {"response": "Success"}
    return data


@main.post("/QeA")
def QeA():
    if os.listdir(FILE_FOLDER):
        user_question = request.form["question"]
        data = {"response": get_conversation_chain().run(question=user_question)}
        return data
    data = {"response": False}
    return data
