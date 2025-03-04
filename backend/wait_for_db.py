import time
import MySQLdb
import os
from django.db import connections
from django.db.utils import OperationalError


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
                port=os.getenv('DATABASE_PORT')
            )
        except MySQLdb.OperationalError:
            print("Database unavailable, waiting 1 second...")
            time.sleep(1)