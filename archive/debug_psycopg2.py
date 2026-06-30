import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

db_name = os.environ.get('DB_NAME', 'portfolio')
user = os.environ.get('DB_USER', 'postgres')
password = os.environ.get('DB_PASSWORD', '')
host = os.environ.get('DB_HOST', '127.0.0.1')
port = os.environ.get('DB_PORT', '5432')

print(f"Testing connection to: {db_name} at {host}:{port} as {user}")

dsn = f"dbname='{db_name}' user='{user}' password='{password}' host='{host}' port='{port}'"

# Check for non-ascii in DSN
try:
    dsn.encode('ascii')
    print("DSN is pure ASCII")
except UnicodeEncodeError as e:
    print(f"DSN contains non-ASCII! {e}")
    for i, c in enumerate(dsn):
        if ord(c) > 127:
            print(f"  Pos {i}: {c} (code: {ord(c)})")

try:
    conn = psycopg2.connect(dsn)
    print("Success! Connection established.")
    conn.close()
except Exception as e:
    print(f"Connection failed: {type(e).__name__}: {e}")
    if hasattr(e, 'args'):
        print(f"Args: {e.args}")
