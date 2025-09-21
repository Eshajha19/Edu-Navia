from flask import Flask, request, jsonify
from flask_cors import CORS
import pywhatkit as kit

app = Flask(__name__)
CORS(app)

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        phone = data.get('phone')  # Must include country code, e.g., +91XXXXXXXXXX
        webinar = data.get('webinar')

        if not name or not phone or not webinar:
            return jsonify({"success": False, "error": "Missing required fields"}), 400

        message = f"Hi {name}, your Edu Navia webinar registration for '{webinar}' is confirmed! 🎓"

        # This will open WhatsApp Web and send instantly
        kit.sendwhatmsg_instantly(phone_no=phone, message=message, wait_time=10, tab_close=True)

        return jsonify({"success": True, "message": "WhatsApp message sent instantly!"})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
