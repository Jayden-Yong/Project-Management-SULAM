import sys
import os

# Add the current directory to sys.path so we can import from backend
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

# 0. Allow passing DATABASE_URL as argument
if len(sys.argv) > 1:
    os.environ["DATABASE_URL"] = sys.argv[1]
    print(f"Using DATABASE_URL from command line argument.")

try:
    from database import engine
except ValueError:
    print("Error: DATABASE_URL is missing.")
    print("Usage: python fix_schema.py <DATABASE_URL>")
    print("       or set DATABASE_URL in .env")
    sys.exit(1)

from sqlalchemy import text

def add_column_if_not_exists(connection, table_name, column_name, column_type):
    check_sql = text(f"""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='{table_name}' AND column_name='{column_name}';
    """)
    result = connection.execute(check_sql).fetchone()
    
    if not result:
        print(f"Adding column '{column_name}' to '{table_name}'...")
        # Note: We don't quote identifiers here for simplicity, assuming simple names
        alter_sql = text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type};")
        connection.execute(alter_sql)
        print(f"Added {column_name}")
    else:
        print(f"Column '{column_name}' already exists in '{table_name}'")

def fix_schema():
    print("Starting schema migration...")
    try:
        with engine.connect() as connection:
            connection.begin()  # Start transaction
            
            # Add missing columns to 'event' table
            # 1. time: Optional[str] -> VARCHAR/TEXT
            add_column_if_not_exists(connection, 'event', 'time', 'VARCHAR')
            
            # 2. duration: Optional[int] -> INTEGER
            add_column_if_not_exists(connection, 'event', 'duration', 'INTEGER')
            
            # 3. contactPerson: Optional[str] -> VARCHAR/TEXT
            add_column_if_not_exists(connection, 'event', 'contactperson', 'VARCHAR')
            
            # 4. requirements: Optional[str] -> VARCHAR/TEXT
            add_column_if_not_exists(connection, 'event', 'requirements', 'VARCHAR')

            connection.commit()
            print("Schema migration completed successfully!")
            
    except Exception as e:
        print(f"Migration failed: {e}")
        raise

if __name__ == "__main__":
    fix_schema()
