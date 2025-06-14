# simple_test_archive.py
# Save this file in your project root and run it

import requests
import json

# Configuration
BASE_URL = 'http://localhost:8000/api'

print("=== Testing Archive/Unarchive Feature ===\n")

# Test credentials - using Bob from your users.json
test_email = 'bob@example.com'
test_password = 'password123'  # You'll need to set this password first

print("First, let's set Bob's password using Django shell:")
print("Run these commands:")
print("""
python manage.py shell

from uniMarktAuth.models import User
user = User.objects.get(email='bob@example.com')
user.set_password('password123')
user.save()
print("Password updated!")
exit()
""")

input("\nPress Enter after you've set the password...")

# Step 1: Login
print("\n1. Logging in...")
login_response = requests.post(
    f'{BASE_URL}/login/',
    json={
        'email': test_email,
        'password': test_password
    }
)

if login_response.status_code == 200:
    data = login_response.json()
    access_token = data['access']
    user_id = data['user']['id']
    
    print(f"✓ Login successful!")
    print(f"  User: {data['user']['name']} ({data['user']['email']})")
    print(f"  Token: {access_token[:30]}...")
    
    # Headers for authenticated requests
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    # Step 2: Get products
    print("\n2. Getting products...")
    products_response = requests.get(f'{BASE_URL}/products/', headers=headers)
    
    if products_response.status_code == 200:
        products = products_response.json()
        # Find products owned by Bob (user id 2)
        bob_products = [p for p in products if p['user']['id'] == user_id]
        
        print(f"✓ Found {len(products)} total products")
        print(f"✓ Bob owns {len(bob_products)} products")
        
        if bob_products:
            # Use the first product Bob owns
            product = bob_products[0]
            product_id = product['product_id']
            
            print(f"\n3. Testing with product: '{product['name']}' (ID: {product_id})")
            print(f"   Current status: {product['status']}")
            
            # Step 3: Archive the product
            print(f"\n4. Archiving product {product_id}...")
            archive_response = requests.post(
                f'{BASE_URL}/products/{product_id}/archive/',
                headers=headers
            )
            
            if archive_response.status_code == 200:
                result = archive_response.json()
                print("✓ Product archived successfully!")
                print(f"  Message: {result['message']}")
                
                # Step 4: Check archived products
                print("\n5. Getting my archived products...")
                archived_response = requests.get(
                    f'{BASE_URL}/products/my-archived/',
                    headers=headers
                )
                
                if archived_response.status_code == 200:
                    archived = archived_response.json()
                    print(f"✓ Found {len(archived)} archived products:")
                    for p in archived:
                        print(f"  - {p['name']} (ID: {p['product_id']})")
                    
                    # Step 5: Unarchive
                    print(f"\n6. Unarchiving product {product_id}...")
                    unarchive_response = requests.post(
                        f'{BASE_URL}/products/{product_id}/unarchive/',
                        headers=headers
                    )
                    
                    if unarchive_response.status_code == 200:
                        result = unarchive_response.json()
                        print("✓ Product unarchived successfully!")
                        print(f"  Message: {result['message']}")
                        print(f"  New status: {result['product']['status']}")
                    else:
                        print(f"✗ Unarchive failed: {unarchive_response.status_code}")
                        print(f"  Error: {unarchive_response.text}")
                        
                else:
                    print(f"✗ Failed to get archived products: {archived_response.status_code}")
                    
            elif archive_response.status_code == 400:
                print("! Product might already be archived")
                print(f"  Error: {archive_response.json()}")
            else:
                print(f"✗ Archive failed: {archive_response.status_code}")
                print(f"  Error: {archive_response.text}")
                
        else:
            print("\n! Bob doesn't own any products.")
            print("  Let's check which products exist...")
            if products:
                print("\n  Available products:")
                for p in products[:5]:  # Show first 5
                    print(f"  - ID: {p['product_id']}, Name: {p['name']}, Owner: {p['user']['name']}")
                    
    else:
        print(f"✗ Failed to get products: {products_response.status_code}")
        print(f"  Error: {products_response.text}")
        
else:
    print(f"✗ Login failed: {login_response.status_code}")
    print(f"  Error: {login_response.text}")
    print("\n  Make sure you've set Bob's password using the Django shell commands above!")

print("\n=== Test Complete ===")