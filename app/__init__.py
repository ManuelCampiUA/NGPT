from flask import Flask
from . import views, functions

functions.before_first_request()
app = Flask(__name__)
app.register_blueprint(views.blueprints)
