import os
import psycopg2
from dotenv import load_dotenv


def get_db_connection():
    load_dotenv()
    conn = psycopg2.connect(
        host=os.environ.get("DB_HOST"),
        port=os.environ.get("DB_PORT"),
        database=os.environ.get("DB_NAME"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASSWORD"),
    )
    return conn


def init_db():
    sql = """DROP TABLE IF EXISTS \"user\";
    CREATE TABLE \"user\" (
        id serial PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );"""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()
    print("Database initialized successfully")
