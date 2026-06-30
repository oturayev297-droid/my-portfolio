import ast
import os
import re

def check_python(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            ast.parse(f.read())
        return []
    except SyntaxError as e:
        return [f"Python Syntax Error in {file_path}: {e}"]

def check_css(file_path):
    errors = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Simple check for balanced braces
            open_braces = content.count('{')
            close_braces = content.count('}')
            if open_braces != close_braces:
                errors.append(f"CSS Brace Mismatch in {file_path}: {open_braces} open, {close_braces} close")
            
            # Check for missing semicolons (basic check)
            # This is hard without a full parser, so we skip for now
    except Exception as e:
        errors.append(f"Error reading CSS {file_path}: {e}")
    return errors

def main():
    report = []
    for root, dirs, files in os.walk('.'):
        if 'venv' in dirs: dirs.remove('venv')
        if '.git' in dirs: dirs.remove('.git')
        
        for file in files:
            full_path = os.path.join(root, file)
            if file.endswith('.py'):
                report.extend(check_python(full_path))
            elif file.endswith('.css'):
                report.extend(check_css(full_path))
    
    if not report:
        print("No critical syntax errors found.")
    else:
        for err in report:
            print(err)

if __name__ == "__main__":
    main()
