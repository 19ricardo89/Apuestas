
import os

path = r'c:\Apuestass\index.html'

def debug_encoding():
    print("Reading file...")
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    print(f"Content length: {len(content)}")
    
    try:
        # Try pure CP1252 reverse
        fixed = content.encode('cp1252').decode('utf-8')
        print("Success with CP1252!")
        with open(path, 'w', encoding='utf-8') as f:
            f.write(fixed)
    except UnicodeEncodeError as e:
        print(f"CP1252 Error: {e}")
        # Identify the failing char
        bad_char = content[e.start:e.end]
        print(f"Failing Char: {bad_char!r} (U+{ord(bad_char[0]):04X}) at pos {e.start}")
        
        # Smart Fix: Iterate and clean
        # If a char is > 255 and NOT correctable, maybe it's already correct? (e.g. previous edit was fine)
        # We will try to fix the string chunk by chunk
        
        new_parts = []
        for char in content:
            try:
                # Try to "fix" the char by round-tripping
                b = char.encode('cp1252')
                decoded = b.decode('utf-8')
                new_parts.append(decoded)
            except UnicodeError:
                # If cannot encode to CP1252 (e.g. char > 255 like proper Emoji or € if mapped to 80), 
                # check if it is 'latin-1' safe?
                try:
                    b = char.encode('latin1')
                    decoded = b.decode('utf-8')
                    new_parts.append(decoded)
                except:
                    # If it fails both, assume it is a Valid Character that survived unharmed (e.g. from a separate edit?)
                    # Or just keep it as is.
                    new_parts.append(char)
        
        final_text = "".join(new_parts)
        print("Reconstructed text using hybrid approach.")
        with open(path, 'w', encoding='utf-8') as f:
            f.write(final_text)
            
if __name__ == "__main__":
    debug_encoding()
