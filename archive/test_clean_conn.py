import os
import psycopg2
from dotenv import load_dotenv

# Suppress system environment interference
os.environ.pop('PGPASSFILE', None)
os.environ.pop('PGSERVICEFILE', None)

load_dotenv()

db_name = os.environ.get('DB_NAME', 'portfolio')
user = os.environ.get('DB_USER', 'postgres')
password = os.environ.get('DB_PASSWORD', '')
host = os.environ.get('DB_HOST', '127.0.0.1')
port = os.environ.get('DB_PORT', '5432')

print(f"Testing connection to: {db_name} as {user}")

dsn = f"dbname={db_name} user={user} password={password} host={host} port={port}"

try:
    conn = psycopg2.connect(dsn)
    print("Success! Connection established.")
    conn.close()
except Exception as e:
    print(f"Connection failed: {e}")
