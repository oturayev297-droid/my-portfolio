import os

def check_tags(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Count tags
    d_o = content.count('<div')
    d_c = content.count('</div>')
    m_o = content.count('<main')
    m_c = content.count('</main>')
    s_o = content.count('<section')
    s_c = content.count('</section>')
    
    res = f"{os.path.basename(filepath)} | DIV:{d_o}/{d_c} | MAIN:{m_o}/{m_c} | SEC:{s_o}/{s_c}"
    if d_o != d_c or m_o != m_c or s_o != s_c:
        res += " [!! MISMATCH !!]"
    else:
        res += " [OK]"
    print(res)

files = ['templates/base.html', 'templates/home.html', 'templates/projects.html', 'templates/resume.html']
for f in files:
    if os.path.exists(f):
        check_tags(f)
