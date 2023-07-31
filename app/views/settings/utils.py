from json import dump, load

def set_api_key(APIKey):
    json = {"APIKey": APIKey}
    with open("APIKey.json", "w") as file:
        dump(json, file)


def get_api_key():
    APIKey = load(open("APIKey.json"))
    return APIKey["APIKey"]