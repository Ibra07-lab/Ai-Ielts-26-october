import re, glob

for f in glob.glob('c:/Users/Honor/Desktop/Новая папка (4)/Ai-Ielts-26-october/frontend/data/vocabulary/*.ts'):
    data = open(f, 'r', encoding='utf-8').read()
    name_m = re.search(r'name:\s*"(.+?)"', data)
    pw_m = re.search(r'previewWords.*?\]', data)
    color_m = re.search(r'color:\s*"(.+?)"', data)
    section_m = re.search(r'ieltsSection:\s*"(.+?)"', data)
    id_m = re.search(r'id:\s*(\d+)', data)
    if name_m:
        print(f'{name_m.group(1)} | id={id_m.group(1) if id_m else "?"} | section={section_m.group(1) if section_m else "?"} | color={color_m.group(1) if color_m else "?"} | preview={pw_m.group() if pw_m else "NONE"}')
