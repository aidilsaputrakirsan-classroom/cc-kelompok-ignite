"""
Script untuk membuat akun admin di database.
Jalankan ini sekali untuk membuat 2 akun admin.

Usage:
    python seed_admin.py
"""

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User
from auth import hash_password
from datetime import datetime, timezone

# Buat semua tabel jika belum ada
Base.metadata.create_all(bind=engine)

def seed_admin_accounts():
    """
    Membuat 2 akun admin di database:
    - email: admin1@gmail.com, password: Admin12345
    - email: admin2@gmail.com, password: Admin12345
    """
    db = SessionLocal()
    
    admin_accounts = [
        {
            "email": "admin1@gmail.com",
            "name": "Admin 1",
            "password": "Admin12345",
        },
        {
            "email": "admin2@gmail.com",
            "name": "Admin 2",
            "password": "Admin12345",
        },
    ]
    
    try:
        for admin in admin_accounts:
            # Cek apakah admin sudah ada
            existing = db.query(User).filter(User.email == admin["email"]).first()
            
            if existing:
                print(f"⚠️  Admin dengan email '{admin['email']}' sudah ada di database")
                continue
            
            # Hash password
            hashed_password = hash_password(admin["password"])
            
            # Buat user baru dengan role admin
            new_admin = User(
                email=admin["email"],
                name=admin["name"],
                password_hash=hashed_password,
                role="admin",
                is_active=True,
                created_at=datetime.now(timezone.utc),
            )
            
            db.add(new_admin)
            print(f"✅ Akun admin '{admin['email']}' berhasil dibuat")
        
        # Commit semua perubahan
        db.commit()
        print("\n" + "="*60)
        print("✅ BERHASIL! Akun admin telah ditambahkan ke database")
        print("="*60)
        print("\n📝 Akun Admin yang tersedia:")
        print("-" * 60)
        for admin in admin_accounts:
            print(f"Email   : {admin['email']}")
            print(f"Password: {admin['password']}")
            print("-" * 60)
        print("\n💡 Admin dapat login di form Login dengan email dan password di atas")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error saat membuat akun admin: {str(e)}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_admin_accounts()