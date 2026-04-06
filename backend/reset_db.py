#!/usr/bin/env python3
"""
Script untuk reset database - drop semua tables dan recreate dengan schema baru.
"""

from database import engine
from models import Base

print("🔄 Reset Database...")
print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)

print("✅ Creating all tables with new schema...")
Base.metadata.create_all(bind=engine)

print("✅ Database reset successful!")
print("All tables created with new schema:")
print("  - users (dengan role field)")
print("  - products")
print("  - carts")
print("  - cart_items")
print("  - items (legacy)")
