from json import load

SECRET_KEY = secret_key = load(open("env.json"))["secretKey"]
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = "Lax"
