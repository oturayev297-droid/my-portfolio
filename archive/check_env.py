import os
from dotenv import load_dotenv

load_dotenv()

keys = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT']
for key in keys:
    val = os.environ.get(key)
    if val:
        try:
            val.encode('ascii')
            print(f"{key}: ASCII OK")
        except UnicodeEncodeError:
            print(f"{key}: Contains non-ASCII characters!")
            # Print non-ascii chars safely
            non_ascii = [c for c in val if ord(c) > 127]
            print(f"  Non-ASCII chars: {non_ascii}")
    else:
        print(f"{key}: Not set")
