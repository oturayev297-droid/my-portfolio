import psycopg
import os
from dotenv import load_dotenv

load_dotenv()

def test_conn():
    print("--- PostgreSQL Connection Diagnostic ---")
    user = os.environ.get('DB_USER', 'postgres')
    password = os.environ.get('DB_PASSWORD', 'ozodbek12345678')
    db = os.environ.get('DB_NAME', 'portfolio')
    host = os.environ.get('DB_HOST', '127.0.0.1')
    
    print(f"Trying to connect to '{db}' as user '{user}' on '{host}'...")
    
    try:
        conn = psycopg.connect(
            dbname=db,
            user=user,
            password=password,
            host=host,
            port=5432,
            connect_timeout=3
        )
        print("SUCCESS: Connection established!")
        conn.close()
    except Exception as e:
        err_str = str(e).encode('ascii', 'replace').decode('ascii')
        print(f"FAILED: {err_str}")
        print("\nPossible solutions:")
        print(f"1. Check if user '{user}' actually has the password you think it has.")
        print(f"2. Try setting the password again: ALTER USER {user} WITH PASSWORD 'new_password';")
        print(f"3. Make sure the database '{db}' exists: CREATE DATABASE {db};")

if __name__ == "__main__":
    test_conn()
