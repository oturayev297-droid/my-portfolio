import psycopg
import sys

def force_reset():
    passwords_to_try = ['ozodbek12345678', '', 'postgres', '12345678', 'admin', 'root']
    success = False
    
    print("--- Automated Password Reset Attempt ---")
    
    for pwd in passwords_to_try:
        try:
            print(f"Trying to connect as 'postgres' with password: '{pwd}'...")
            conn = psycopg.connect(
                dbname='postgres',
                user='postgres',
                password=pwd,
                host='127.0.0.1',
                autocommit=True,
                connect_timeout=2
            )
            print(f"SUCCESS: Logged in as admin!")
            
            with conn.cursor() as cur:
                # Reset master password if exists
                print("Setting password for user 'master'...")
                try:
                    cur.execute("ALTER USER master WITH PASSWORD 'ozodbek12345678';")
                except Exception as alter_err:
                    print(f"Skipping master role reset: {repr(alter_err)}")
                
                # Ensure database exists
                print("Ensuring database 'portfolio' exists...")
                cur.execute("SELECT 1 FROM pg_database WHERE datname='portfolio'")
                if not cur.fetchone():
                    cur.execute("CREATE DATABASE portfolio")
                    print("Database 'portfolio' created.")
                else:
                    print("Database 'portfolio' already exists.")
            
            conn.close()
            success = True
            break
        except Exception as e:
            err_str = str(e).encode('ascii', 'replace').decode('ascii')
            print(f"Failed with password '{pwd}': {err_str}")
    
    if success:
        print("\nALL GOOD! Now run 'python manage.py migrate'")
    else:
        print("\nAuto-reset failed. Please use pgAdmin GUI to reset the password for 'master'.")

if __name__ == "__main__":
    force_reset()
