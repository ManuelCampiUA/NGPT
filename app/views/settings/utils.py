from json import dump, load


def set_api_key(APIKey):
    data = {"APIKey": APIKey}
    with open("APIKey.json", "w") as file:
        dump(data, file)


def get_api_key():
    with open("APIKey.json") as file:
        data = load(file)
    return data.get("APIKey", None)


def get_temp_password():
    with open("tempuser.json") as file:
        data = load(file)
    return data.get("tempPassword", None)
