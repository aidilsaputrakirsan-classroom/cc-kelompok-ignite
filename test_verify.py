import requests

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiZXhwIjoxNzE3OTQwMDk4fQ.VBPzlDSn8LKNqPbJfHnCpOu3LMFV_Fl8_UQQlGNR5EY"

headers = {"Authorization": f"Bearer {token}"}

print("Testing verify endpoint via gateway:")
try:
    r = requests.get("http://localhost/auth/verify", headers=headers, timeout=5)
    print(f"Status: {r.status_code}")
    print(f"Response: {r.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
