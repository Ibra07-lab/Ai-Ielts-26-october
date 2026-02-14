import re

def analyze_braces(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    stack = []
    
    # Regex to catch comments, strings, and braces
    # simple state machine is better
    
    in_string = False
    string_char = ''
    in_comment = False # //
    in_block_comment = False # /* */
    
    for line_idx, line in enumerate(lines):
        i = 0
        while i < len(line):
            char = line[i]
            
            # Skip checking if inside string or comment
            if in_block_comment:
                if line[i:i+2] == '*/':
                    in_block_comment = False
                    i += 1
                i += 1
                continue
            
            if in_string:
                if char == '\\':
                    i += 1 # skip next
                elif char == string_char:
                    in_string = False
                i += 1
                continue
            
            if in_comment:
                # Comment ends at newline, which is end of line string provided by readlines usually includes \n
                # but we process line by line.
                # Actually specific logic for // comment: it ends at end of line.
                # So if we are in_comment, we just break the loop for this line?
                # No, we set in_comment = False at start of new line? 
                # Let's handle // detection below.
                break 

            # Start of string
            if char in ['"', "'", '`']:
                in_string = True
                string_char = char
                i += 1
                continue
                
            # Start of comments
            if char == '/' and i + 1 < len(line):
                if line[i+1] == '/':
                    in_comment = True
                    i += 2
                    continue
                elif line[i+1] == '*':
                    in_block_comment = True
                    i += 2
                    continue
            
            # Braces
            if char == '{':
                stack.append((line_idx + 1, i + 1))
            elif char == '}':
                if not stack:
                    print(f"Error: Unexpected '}}' at Line {line_idx+1}, Col {i+1}")
                else:
                    stack.pop()
                    
            i += 1
        
        # Reset single line comment at end of line
        in_comment = False

    if stack:
        print("Error: Unclosed '{' matches found. Showing last 5:")
        for pos in stack[-5:]:
            print(f"  Line {pos[0]}, Col {pos[1]}")
        
        print("\nLast unclosed brace content (Line {}):".format(stack[-1][0]))
        print(lines[stack[-1][0]-1].strip())
    else:
        print("Braces appear balanced.")

if __name__ == "__main__":
    analyze_braces(r"c:\Users\Honor\Desktop\Новая папка (4)\Ai-Ielts-26-october\frontend\components\listening\ListeningWorksheet.tsx")
