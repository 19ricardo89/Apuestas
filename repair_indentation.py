
import re

filepath = 'c:/Apuestass/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Heuristic:
# If a line is not empty, and starts at column 0, but surrounding non-empty lines are indented,
# inherit the indentation of the previous non-empty line.
# Specifically targeting lines starting with 'const', 'let', '//', 'function' inside the main component.

fixed_lines = []
last_indent = ""

# We'll do a two-pass or just a smart one-pass.
# One pass should be enough if we just want to fix the sudden drops to 0.

# Main component detection (approximate)
inside_component = False

for i, line in enumerate(lines):
    content = line.strip()
    if not content:
        fixed_lines.append(line)
        continue
    
    # Calculate current indentation
    current_indent = line[:len(line) - len(line.lstrip())]
    
    # Detection of sudden 0-indent
    if len(current_indent) == 0 and len(last_indent) > 0:
        # Check if this line looks like it belongs to the block
        # Heuristic: It's 'const', 'let', or valid JS code, not a closing brace at column 0
        if not content.startswith('}') and not content.startswith('</script'):
            # Apply last indent
            # But wait, what if the block closed?
            # If previous line ended with ';', indentation typically stays same.
            # If previous line ended with '{', indentation typically increases.
            # If previous line was '}', indentation decreases.
            
            # Simple fix for the specific artifact: lines starting with 'const' or '//' that dropped to 0
            if content.startswith('const ') or content.startswith('let ') or content.startswith('//') or content.startswith('function '):
                 # Verify next line too?
                 # If I just blindly apply last_indent to 'const', it corrects the error I introduced.
                 # Because I wiped indentation only on "Triple Gap" lines.
                 line = last_indent + line
                 current_indent = last_indent # Update current indent for next lines
    
    fixed_lines.append(line)
    last_indent = current_indent

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(fixed_lines)

print(f"Repaired indentation in {filepath}")
