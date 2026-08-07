import json

with open(r'c:\Users\jorel\Downloads\hackaton\G9-LATAM-TEAM-60-main\G9-LATAM-TEAM-60\Week 2\EnergiAI_v2.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

cells = [c for c in nb['cells'] if c['cell_type'] == 'code']
print(f'Total code cells: {len(cells)}')

for i, c in enumerate(cells):
    src = ''.join(c['source'])
    print(f'\n=== CELL {i} ===')
    print(src[:800])
    if len(src) > 800:
        print('... (truncated)')
