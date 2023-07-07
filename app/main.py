import os
from flask import Blueprint, render_template, request
from werkzeug.utils import secure_filename
from .auth import login_required
from .functions import FILE_FOLDER, load_AI, allowed_file, get_conversation_chain


main = Blueprint("main", __name__)


@main.route("/")
@login_required
def home():
    if os.listdir(FILE_FOLDER):
        load_AI()
    files = os.listdir(FILE_FOLDER)
    return render_template("index.html", files=files)


@main.post("/upload")
@login_required
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
@login_required
def get_file_list():
    files = os.listdir(FILE_FOLDER)
    data = {"response": files}
    return data


@main.get("/process")
@login_required
def process():
    load_AI()
    # Test
    from time import sleep

    sleep(2)
    data = {"response": "Success"}
    return data


@main.post("/QeA")
@login_required
def QeA():
    if os.listdir(FILE_FOLDER):
        user_question = request.form["question"]
        # Test
        from time import sleep

        sleep(2)
        data = {
            "response": "Pariatur dolore aliqua in ad ullamco dolore consectetur sint dolore excepteur consequat in aliqua fugiat. Ipsum pariatur amet occaecat quis. Labore duis occaecat tempor ad et officia ullamco. Occaecat aute voluptate tempor cillum incididunt. Aliquip qui voluptate do laborum consectetur anim officia qui enim minim."
        }  # get_conversation_chain().run(question=user_question)}
        return data
    data = {"response": False}
    return data
