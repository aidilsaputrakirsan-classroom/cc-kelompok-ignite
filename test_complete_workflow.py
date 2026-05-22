#!/usr/bin/env python
"""Full microservices workflow test with debugging"""

import requests
import json

print("\n" + "=" * 70)
print("COMPLETE MICROSERVICES WORKFLOW TEST")
print("=" * 70)

BASE_URL = "http://localhost"

# Step 1: Register
print("\n1️⃣  REGISTER USER")
register_data = {
    "email": "testuser123@example.com",
    "password": "TestPassword123",
    "name": "Test User 123",
}
r = requests.post(f"{BASE_URL}/auth/register", json=register_data)
print(f"   Status: {r.status_code}")
if r.status_code == 201:
    print(f"   ✅ User registered successfully")
elif r.status_code == 400:
    print(f"   ℹ️  User already exists")
else:
    print(f"   ❌ Error: {r.text}")

# Step 2: Login and get token
print("\n2️⃣  LOGIN USER")
login_data = {"email": "testuser123@example.com", "password": "TestPassword123"}
r = requests.post(f"{BASE_URL}/auth/login", json=login_data)
print(f"   Status: {r.status_code}")
token = None
if r.status_code == 200:
    token_data = r.json()
    token = token_data.get("access_token")
    print(f"   ✅ Login successful")
    print(f"   Token: {token[:40]}...")
else:
    print(f"   ❌ Error: {r.text}")

# Step 3: Verify token directly
if token:
    print("\n3️⃣  VERIFY TOKEN (Auth Service)")
    headers = {"Authorization": f"Bearer {token}"}
    r = requests.get(f"{BASE_URL}/auth/verify", headers=headers)
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        user_info = r.json()
        print(f"   ✅ Token verified")
        print(f"   User: {user_info}")
    else:
        print(f"   ❌ Error: {r.text}")

# Step 4: Create Item
if token:
    print("\n4️⃣  CREATE ITEM (Item Service, requires auth)")
    headers = {"Authorization": f"Bearer {token}"}
    item_data = {
        "name": "Amplang Balikpapan",
        "description": "Makanan khas Balikpapan",
        "category": "makanan",
        "price": 25000,
        "stock": 50,
    }
    r = requests.post(f"{BASE_URL}/items", json=item_data, headers=headers)
    print(f"   Status: {r.status_code}")
    if r.status_code == 201:
        print(f"   ✅ Item created: {r.json()}")
    else:
        print(f"   ❌ Error: {r.text}")

# Step 5: Get Items
if token:
    print("\n5️⃣  GET ITEMS LIST (Item Service, requires auth)")
    headers = {"Authorization": f"Bearer {token}"}
    r = requests.get(f"{BASE_URL}/items", headers=headers)
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        items_data = r.json()
        print(f"   ✅ Retrieved items: {items_data}")
    else:
        print(f"   ❌ Error: {r.text}")

# Step 6: Test inter-service communication indirectly
if token:
    print("\n6️⃣  INTER-SERVICE COMMUNICATION TEST")
    print("   (Item Service verifying token with Auth Service)")
    # The item service will internally call auth service to verify token
    headers = {"Authorization": f"Bearer {token}"}
    r = requests.post(
        f"{BASE_URL}/items",
        json={"name": "Test Item", "price": 10000, "stock": 5},
        headers=headers,
    )
    print(f"   Status: {r.status_code}")
    if r.status_code == 201:
        print(f"   ✅ Inter-service communication working")
    elif r.status_code == 503:
        print(f"   ❌ Auth Service unreachable from Item Service")
        print(f"      Response: {r.text}")
    else:
        print(f"   Status: {r.status_code} - {r.text}")

print("\n" + "=" * 70)
print("✅ TEST COMPLETED")
print("=" * 70 + "\n")
