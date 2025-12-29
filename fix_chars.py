
path = r'c:\Apuestass\index.html'

replacements = [
    ('Ã¡', 'á'),
    ('Ã©', 'é'),
    ('Ãí', 'í'), # Just in case
    ('Ã\xad', 'í'), # Soft hyphen variant
    ('Ã³', 'ó'),
    ('Ãº', 'ú'),
    ('Ã±', 'ñ'),
    ('â‚¬', '€'),
    ('Ã', 'í'), # Aggressive fallback for 'EstadAsticas' if it was 'EstadÃsticas' where Ã came from í (0xC3 0xAD) and AD played hide and seek. 
                # WARNING: This changes ALL standalone Ã to í. 
                # Ã is rarely used alone in Spanish. It is usually part of a sequence.
                # However, carefully: 'Gestión' became 'GestiÃ³n'. Ã³ was handled above.
                # So if Ã matches separately, it might be 'í'.
                # Let's put this LAST.
]

# Better approach for 'í': 
# If we see 'Ã' followed by 's' (as in Estadísticas), it's likely 'í'.
# But regex is better? Let's stick to simple replace for now.

def fix():
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Apply specific fixes
        new_content = content
        new_content = new_content.replace('Ã³', 'ó')
        new_content = new_content.replace('Ã©', 'é')
        new_content = new_content.replace('Ã¡', 'á')
        new_content = new_content.replace('Ãº', 'ú')
        new_content = new_content.replace('Ã±', 'ñ')
        new_content = new_content.replace('â‚¬', '€')
        
        # Hard fix for Tipster names or specific words if generic failed
        new_content = new_content.replace('EstadAsticas', 'Estadísticas') # If user literally saw 'A'
        new_content = new_content.replace('EstadÃsticas', 'Estadísticas')
        new_content = new_content.replace('GestiA3n', 'Gestión') # User report
        new_content = new_content.replace('GestiÃ³n', 'Gestión')

        # Fix 'í' specifically (C3 AD)
        # If the file has C3 followed by AD, it IS valid UTF-8 'í'.
        # If it has C3 followed by 83 (Ã)...
        # Let's blindly replace 'EstadÃsticas' (already done).
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Fixed specific patterns.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix()
