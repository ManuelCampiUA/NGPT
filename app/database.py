from flask import Blueprint, g
from sqlite3 import connect
from werkzeug.security import generate_password_hash

DATABASE = "database.sqlite"

database = Blueprint("database", __name__)


def get_db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = connect(DATABASE)
    return db


@database.teardown_app_request
def close_connection(exception):
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()


def init_db():
    db = connect(DATABASE)
    sql = f"""DROP TABLE IF EXISTS user;
    CREATE TABLE user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        isAdmin INTEGER
    );
    INSERT INTO user (username, password, isAdmin)
    VALUES('admin', '{generate_password_hash("password")}', 1);"""
    db.cursor().executescript(sql)
    db.commit()
    db.close()
    print("Database initialized")
