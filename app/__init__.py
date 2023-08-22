from flask import Flask
from json import load
from datetime import timedelta
from werkzeug.middleware.proxy_fix import ProxyFix
from .database import database
from .views.error import error_views
from .views.auth import auth_views, login_manager
from .views.index import index_views
from .views.settings import settings_views
from .views.chat import chat_views


def internal_server_error(e):
    data = {"response": "Server error"}
    return data, 500


def create_app():
    app = Flask(__name__)
    secret_key = load(open("config.json"))["secretKey"]
    app.config.update(
        SECRET_KEY=secret_key,
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
        REMEMBER_COOKIE_DURATION=timedelta(hours=1),
    )
    app.register_error_handler(500, internal_server_error)
    app.register_blueprint(database, cli_group=None)
    app.register_blueprint(error_views)
    app.register_blueprint(auth_views)
    app.register_blueprint(index_views)
    app.register_blueprint(settings_views)
    app.register_blueprint(chat_views)
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
    login_manager.init_app(app)
    return app
