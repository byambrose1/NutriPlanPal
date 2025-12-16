import os
import psycopg2

# Connect to Supabase PostgreSQL
conn = psycopg2.connect(os.environ["DATABASE_URL"])

cur = conn.cursor()
cur.execute("SELECT NOW();")  # Ask the database for the current time

print("Connected! Server time is:", cur.fetchone())

cur.close()
conn.close()
