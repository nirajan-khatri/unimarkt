import socket
import time
import sys

host = "db"
port = 3306
max_attempts = 30
attempt = 0

print("Checking connection to MySQL at {}:{}".format(host, port))

while attempt < max_attempts:
    attempt += 1
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex((host, port))
        sock.close()
        if result == 0:
            print("MySQL is ready!")
            sys.exit(0)
    except socket.error:
        pass
    
    print(f"Attempt {attempt}/{max_attempts}: MySQL not ready yet, waiting...")
    time.sleep(5)

print("Could not connect to MySQL after {} attempts".format(max_attempts))
sys.exit(1)
