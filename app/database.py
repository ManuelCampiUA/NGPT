from flask import Blueprint, g
from sqlite3 import connect
from werkzeug.security import generate_password_hash
from random import choice
from string import ascii_letters, digits, punctuation

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


@database.cli.command("init-db")
def init_db():
    """Initialize the database"""
    db = connect(DATABASE)
    sql = f"""DROP TABLE IF EXISTS user;
    CREATE TABLE user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        isAdmin INTEGER
    );
    INSERT INTO user (username, password, isAdmin)
    VALUES('admin', '{generate_password_hash("toreros")}', 1);
    INSERT INTO user (username, password)
    VALUES('tempuser', '{"temppassword"}');"""
    db.cursor().executescript(sql)
    db.commit()
    db.close()
    print("Database initialized")


@database.cli.command("change-temp-user")
def change_temp_user():
    """Change temporary user password"""
    password = ""
    for i in range(6):
        tempchar = choice(ascii_letters + digits + punctuation)
        password += tempchar
    db = connect(DATABASE)
    sql = f"""UPDATE user
    SET password = '{password}'
    WHERE id = 2;"""
    db.cursor().executescript(sql)
    db.commit()
    db.close()
    print("Temporary user modified")
