import time
import MySQLdb
import os
from MySQLdb import OperationalError

def wait_for_db():
    """Wait until MySQL is available."""
    db_conn = None
    while db_conn is None:
        try:
            print("Waiting for database...")
            db_conn = MySQLdb.connect(
                host=os.getenv('DATABASE_HOST'),  # The service name defined in your docker-compose.yml
                user=os.getenv('DATABASE_USER'),
                password=os.getenv('DATABASE_PASSWORD'),
                database=os.getenv('DATABASE_NAME'),
                port=int(os.getenv('DATABASE_PORT'))
            )
            print("Database connected!")
        except OperationalError as e:
            print(f"Database unavailable, waiting 1 second... Error: {e}")
            time.sleep(1)
        except Exception as e:
            print(f"Unexpected error: {e}")
            time.sleep(1)

if __name__ == "__main__":
    wait_for_db()