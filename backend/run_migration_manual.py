import psycopg2
import sys

# Connection details from encore db conn-uri ielts
DB_URI = "postgresql://ai-ielts-app-ybri:local@127.0.0.1:9500/ielts?sslmode=disable"
MIGRATION_FILE = r"c:\Users\Honor\Desktop\Новая папка (4)\Ai-Ielts-26-october\backend\ielts\migrations\8_fix_reading_highlights_schema.up.sql"

def apply_migration():
    try:
        # Connect to the database
        conn = psycopg2.connect(DB_URI)
        conn.autocommit = True
        cur = conn.cursor()
        
        print(f"Applying migration: {MIGRATION_FILE}")
        
        with open(MIGRATION_FILE, 'r', encoding='utf-8') as f:
            sql = f.read()
            
        # Execute the SQL
        # We handle DO blocks and multiple statements
        cur.execute(sql)
        
        print("Migration applied successfully!")
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Error applying migration: {e}")
        return False

if __name__ == "__main__":
    if apply_migration():
        sys.exit(0)
    else:
        sys.exit(1)
