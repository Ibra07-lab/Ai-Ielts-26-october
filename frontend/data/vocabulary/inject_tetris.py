import re

# Read the generated array
with open("tetris_output.js", "r", encoding="utf-8") as f:
    tetris_data = f.read()

# Make sure em dashes and quotes are well-formed.
# The data was saved via python so it's clean UTF-8.

with open("shopping.ts", "r", encoding="utf-8") as f:
    shopping_code = f.read()

# Replace contextTetris: []
new_code = shopping_code.replace("contextTetris: []", f"contextTetris: {tetris_data.strip()}")

with open("shopping.ts", "w", encoding="utf-8") as f:
    f.write(new_code)

print("Insertion successful!")
