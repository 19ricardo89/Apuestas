
file_path = r"c:\Apuestass\index.html"
target_header = "{/* CASH OUT MODAL (GLOBALIZED V55) */}"

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    found = False
    for i, line in enumerate(lines):
        if "CASH OUT MODAL (GLOBALIZED V55)" in line:
            print(f"Header found at line {i+1}")
            # Print next 30 lines
            for j in range(i, min(i+35, len(lines))):
                 print(f"{j+1}: {repr(lines[j])}")
            found = True
            break
    
    if not found:
        print("Header NOT found.")

except Exception as e:
    print(e)
