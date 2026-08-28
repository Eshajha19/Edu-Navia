import os
import glob

def update_footers_v2():
    html_files = glob.glob('d:/Edu Navia/*.html')
    
    footer_links_snippet = '''
    <div style="margin-top: 15px; text-align: center;">
        <a href="privacy.html" style="color: #00bfa6; text-decoration: none; font-size: 0.95rem; margin-right: 15px; font-weight: 500;">Privacy Policy</a>
        <a href="terms.html" style="color: #00bfa6; text-decoration: none; font-size: 0.95rem; font-weight: 500;">Terms & Conditions</a>
    </div>
</footer>'''

    count = 0
    for file in html_files:
        with open(file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        # Skip if already contains privacy policy link
        if 'href="privacy.html"' in content:
            continue
            
        # Ensure it has a footer tag
        if '</footer>' in content:
            new_content = content.replace('</footer>', footer_links_snippet)
            
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            count += 1
            
    print(f"Successfully added Privacy and Terms links to {count} additional HTML files!")

if __name__ == "__main__":
    update_footers_v2()
