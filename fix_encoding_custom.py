
import os

filepath = 'c:/Apuestass/index.html'

try:
    with open(filepath, 'rb') as f:
        content = f.read()

    # Common UTF-8 artifacts from double encoding or ISO-8859-1 interpretation
    # Ã± -> ñ (C3 B1) -> Read as C3 83 C2 B1 if double? 
    # Let's simple string replace widely known patterns if read as utf-8
    
    s = content.decode('utf-8')
    
    replacements = {
        'Ã±': 'ñ',
        'Ã¡': 'á',
        'Ã©': 'é',
        'Ã\xad': 'í', # Ã-soft-hyphen? No, it's usually Ã­ (C3 AD) -> C3 83 C2 AD?
        'Ã³': 'ó',
        'Ãº': 'ú',
        'Ã‘': 'Ñ',
        'Ã\x81': 'Á',
        'Ã\x89': 'É',
        'Ã\x8d': 'Í',
        'Ã\x93': 'Ó',
        'Ã\x9a': 'Ú',
        'Â¿': '¿',
        'Â¡': '¡',
        'âœ…': '✅',
        'âš ': '⚠️', # Warning
        'âš ï¸ ': '⚠️',
        'ðŸ”®': '🔮',
        'ðŸ”„': '🔄',
        'Ã¼': 'ü',
        'Ã–': 'Ö',
        'Ãª': 'ê',
        # Fix specific 'Ã-' for 'í' if needed
        'Ã­': 'í' 
    }
    
    for bad, good in replacements.items():
        s = s.replace(bad, good)
        
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(s)
        
    print("Encoding fixed successfully.")

except Exception as e:
    print(f"Error: {e}")
