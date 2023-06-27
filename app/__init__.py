from flask import Flask
from .views import views
from .functions import before_first_request

before_first_request()
app = Flask(__name__)
app.register_blueprint(views)
