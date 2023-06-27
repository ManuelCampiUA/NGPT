import os
from flask import Blueprint, render_template, request
from werkzeug.utils import secure_filename
from .functions import *


blueprints = Blueprint("views", __name__)


@blueprints.route("/")
def home():
    return render_template("index.html")


@blueprints.route("/test")
def test():
    files = os.listdir(FILE_FOLDER)
    return render_template("test.html", files=files)


@blueprints.post("/upload")
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
        load_AI()
        return {"response": "Success"}
    return {"response": "Error"}


@blueprints.get("/get_file_list")
def get_file_list():
    files = os.listdir(FILE_FOLDER)
    data = {"response": files}
    return data


@blueprints.post("/QeA")
def QeA():
    if os.listdir(FILE_FOLDER):
        user_question = request.json["question"]
        data = {"response": get_conversation_chain().run(question=user_question)}
        return data
    data = {"response": False}
    return data
