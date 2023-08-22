from json import dump, load

CONFIG_FILE = "config.json"

def set_api_key(APIKey):
    data = {"APIKey": APIKey}
    with open(CONFIG_FILE, "w") as file:
        dump(data, file)


def get_api_key():
    with open(CONFIG_FILE) as file:
        data = load(file)
    return data.get("APIKey", None)


def get_temp_password():
    with open(CONFIG_FILE) as file:
        data = load(file)
    return data.get("tempPassword", None)
