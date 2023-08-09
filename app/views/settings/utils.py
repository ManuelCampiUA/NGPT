from json import dump, load
from ...database import get_db


def set_api_key(APIKey):
    json = {"APIKey": APIKey}
    with open("APIKey.json", "w") as file:
        dump(json, file)


def get_api_key():
    APIKey = load(open("APIKey.json"))
    return APIKey["APIKey"]


def get_temp_password():
    db = get_db()
    temp_password = db.execute(
        "SELECT password FROM user WHERE username = 'tempuser';"
    ).fetchone()
    return temp_password[0]
