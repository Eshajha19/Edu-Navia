import os
import glob
import re

def update_footers():
    html_files = glob.glob('d:/Edu Navia/*.html')
    
    footer_links_snippet = '''
      <div class="footer-links" style="margin-top: 25px; display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
        <a href="privacy.html" style="color: #00a88e; text-decoration: none; font-size: 0.95rem; font-weight: 600; padding: 8px 16px; border-radius: 20px; background: rgba(0, 168, 142, 0.05); transition: all 0.3s ease;">Privacy Policy</a>
        <a href="terms.html" style="color: #00a88e; text-decoration: none; font-size: 0.95rem; font-weight: 600; padding: 8px 16px; border-radius: 20px; background: rgba(0, 168, 142, 0.05); transition: all 0.3s ease;">Terms & Conditions</a>
      </div>
      <div class="contact-info">'''

    count = 0
    for file in html_files:
        with open(file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        # Skip if already contains the updated links to prevent duplicates
        if 'href="privacy.html"' in content and '<div class="footer-links"' in content:
            continue
            
        # Only inject if the file has standard footer's contact-info
        if '<div class="contact-info">' in content:
            # Replace the first instance (or all instances if multiple) 
            new_content = content.replace('<div class="contact-info">', footer_links_snippet)
            
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            count += 1
            
    print(f"Successfully added Privacy and Terms links to {count} HTML files!")

if __name__ == "__main__":
    update_footers()
