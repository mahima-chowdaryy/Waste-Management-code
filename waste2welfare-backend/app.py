from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/submit-donation', methods=['POST'])
def submit_donation():
    data = request.json
    name = data.get('name')
    mobile = data.get('mobile')
    donation_type = data.get('donation_type')
    address = data.get('address')
    message = data.get('message')

    if not all([name, mobile, donation_type, address]):
        return jsonify({'error': 'Missing required fields'}), 400

    # Here you can add code to save the data to a database if needed

    return jsonify({'message': 'Donation submitted successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
