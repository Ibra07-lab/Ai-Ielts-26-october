# migrations/run_migrations.py

"""
Simple migration runner for development.
Run with: python -m migrations.run_migrations
"""

import asyncio
import asyncpg
from pathlib import Path

async def run_migrations():
    """Run all SQL migrations."""
    # Database connection parameters
    DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/ielts_tutor"
    
    print("Connecting to database...")
    conn = await asyncpg.connect(DATABASE_URL)
    
    try:
        # Get migrations directory
        migrations_dir = Path(__file__).parent
        migration_files = sorted(migrations_dir.glob("*.sql"))
        
        if not migration_files:
            print("No migration files found!")
            return
        
        print(f"Found {len(migration_files)} migration file(s)")
        
        for migration_file in migration_files:
            print(f"\nRunning migration: {migration_file.name}")
            sql = migration_file.read_text(encoding='utf-8')
            
            try:
                await conn.execute(sql)
                print(f"✅ Successfully applied {migration_file.name}")
            except Exception as e:
                print(f"❌ Error applying {migration_file.name}: {e}")
                raise
        
        print("\n✅ All migrations completed successfully!")
        
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(run_migrations())
