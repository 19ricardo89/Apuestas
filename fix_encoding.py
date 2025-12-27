
import os
import sys

file_path = r'c:\Apuestass\index.html'

def fix_file(path):
    print(f"Reading {path}...")
    try:
        # Read as UTF-8 (which contains the mojibake like 'Ã³')
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Attempt to reverse the mojibake:
        # The characters in 'content' represent the BYTES of the original UTF-8 file interpretated as CP1252.
        # So we encode back to CP1252 to get the original bytes, then decode as UTF-8.
        try:
            # Try Windows-1252 first (standard for Western Europe Windows PowerShell)
            fixed_content = content.encode('cp1252').decode('utf-8')
            print("Successfully decoded using CP1252 -> UTF-8")
        except UnicodeError:
            print("CP1252 failed, trying Latin-1...")
            # Fallback to Latin-1 (direct 1-to-1 mapping)
            fixed_content = content.encode('latin1').decode('utf-8')
            print("Successfully decoded using Latin-1 -> UTF-8")

        # Write back as clean UTF-8
        with open(path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        
        print("File saved successfully.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_file(file_path)
