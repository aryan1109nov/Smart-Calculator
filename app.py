from flask import Flask, render_template, request, jsonify, send_file
import qrcode
from io import BytesIO

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.json
    operation = data["operation"]
    values = data["values"]

    try:
        if operation == "total":
            result = sum(values)
        elif operation == "discount":
            total, discount_percent = values
            result = total * (1 - discount_percent / 100)
        elif operation == "tax":
            total, tax_percent = values
            result = total * (1 + tax_percent / 100)
        elif operation == "profit":
            cost_price, profit_percent = values
            result = cost_price * (1 + profit_percent / 100)
        elif operation == "split":
            total, num_people = values
            result = total / num_people
        else:
            return jsonify({"error": "Invalid operation"}), 400

        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/generate_qr", methods=["POST"])
def generate_qr():
    data = request.json
    total_amount = data["total_amount"]
    upi_id = "7856014216@ybl"  # Replace with your UPI ID or payment link

    # Create QR code data
    qr_data = f"upi://pay?pa={upi_id}&pn=Shopkeeper&am={total_amount}&cu=INR"

    # Generate QR code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(qr_data)
    qr.make(fit=True)
    img = qr.make_image(fill="black", back_color="white")

    # Save QR code to a BytesIO object
    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)

    return send_file(buf, mimetype="image/png")

if __name__ == "__main__":
    app.run(debug=True)