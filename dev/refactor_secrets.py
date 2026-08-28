import os
import re

directory = '.'

firebase_regex = re.compile(r"""const\s+firebaseConfig\s*=\s*\{\s*apiKey:\s*["']AIza[a-zA-Z0-9_\-]+["'],\s*authDomain:\s*["'][a-zA-Z0-9_\-\.]+["'],\s*projectId:\s*["'][a-zA-Z0-9_\-]+["'],\s*storageBucket:\s*["'][a-zA-Z0-9_\-\.]+["'],\s*messagingSenderId:\s*["'][0-9]+["'],\s*appId:\s*["'][0-9a-zA-Z:]+["']\s*};""", re.DOTALL)

firebase_replacement = """const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};"""

emailjs_init_regex = re.compile(r"""emailjs\.init\(\s*["']XNuIdOImhADBCVO2-["']\s*\);?""")
emailjs_init_replacement = """emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);"""

emailjs_send_regex_1 = re.compile(r"""emailjs\.send\(\s*["']service_5e42qtn["']\s*,\s*["']template_xr0hqrk["']""")
emailjs_send_replacement_1 = """emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID_1, import.meta.env.VITE_EMAILJS_TEMPLATE_ID_1"""

emailjs_send_regex_2 = re.compile(r"""emailjs\.send\(\s*["']service_q19sf0g["']\s*,\s*["']template_1vqcw07["']""")
emailjs_send_replacement_2 = """emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID_2, import.meta.env.VITE_EMAILJS_TEMPLATE_ID_2"""

files_modified = 0

for root, _, files in os.walk(directory):
    if "node_modules" in root or "backend" in root or ".git" in root:
        continue
    for file in files:
        if file.endswith('.html') or file.endswith('.js'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            new_content = content
            # Firebase config
            new_content = firebase_regex.sub(firebase_replacement, new_content)
            
            # EmailJS configs
            new_content = emailjs_init_regex.sub(emailjs_init_replacement, new_content)
            new_content = emailjs_send_regex_1.sub(emailjs_send_replacement_1, new_content)
            new_content = emailjs_send_regex_2.sub(emailjs_send_replacement_2, new_content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                files_modified += 1
                print(f"Updated: {filepath}")

print(f"Total files updated securely: {files_modified}")
