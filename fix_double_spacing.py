
import re

filepath = 'c:/Apuestass/index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Normalize line endings
content = content.replace('\r\n', '\n')

# Strategy:
# 1. Identify "Triple Newlines" (which represent intended blank lines in a double-spaced file). 
#    We map them to a placeholder.
#    Triple newline means: Code\n(Blank)\n(Blank)\nCode
#    Regex: \n\s*\n\s*\n
# 2. Identify "Double Newlines" (which represent the double-spacing noise).
#    We map them to single newlines.
#    Regex: \n\s*\n
# 3. Restore placeholders.

# Step 1: Protect "Real" Gaps (3 or more newlines) -> become 2 newlines (1 blank line)
# Note: We use a unique marker.
full_gap_pattern = re.compile(r'\n\s*\n\s*\n\s*')
content_temp = full_gap_pattern.sub('\n\n', content) 
# Wait, if I reduce 3 to 2 immediately, step 2 might reduce 2 to 1.
# So I should protect them.
marker = "___REAL_GAP___"
content_temp = full_gap_pattern.sub(marker, content)

# Step 2: Squash "Noise" Gaps (2 newlines) -> become 1 newline
# \n\s*\n -> \n
noise_pattern = re.compile(r'\n\s*\n')
content_temp = noise_pattern.sub('\n', content_temp)

# Step 3: Restore Real Gaps (marker -> \n\n)
content_final = content_temp.replace(marker, '\n\n')

# Step 4: Verification / Cleanup excessive gaps remaining
# Just to be sure we don't have 4+ blanks
content_final = re.sub(r'\n{3,}', '\n\n', content_final)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content_final)

print(f"Fixed double spacing in {filepath}")
