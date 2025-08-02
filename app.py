from flask import Flask, render_template, send_from_directory, jsonify, request
import os

app = Flask(__name__)

# Serve static files with route prefix handling
@app.route('/src/<path:filename>')
def serve_static(filename):
    return send_from_directory('src', filename)

# Handle static files with route prefixes (like /review/src/...)
@app.route('/<path:route>/src/<path:filename>')
def serve_static_with_prefix(route, filename):
    return send_from_directory('src', filename)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('.', 'favicon.ico')

# Handle favicon with route prefixes
@app.route('/<path:route>/favicon.ico')
def favicon_with_prefix(route):
    return send_from_directory('.', 'favicon.ico')

# Main routes
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/reviews')
def reviews():
    return send_from_directory('.', 'index.html')

@app.route('/review/<int:review_id>')
def review_detail(review_id):
    return send_from_directory('.', 'index.html')

@app.route('/plays')
def plays():
    return send_from_directory('.', 'index.html')

@app.route('/play/<int:play_id>')
def play_detail(play_id):
    return send_from_directory('.', 'index.html')

@app.route('/calendar')
def calendar():
    return send_from_directory('.', 'index.html')

@app.route('/upcoming')
def upcoming():
    return send_from_directory('.', 'index.html')

@app.route('/past')
def past():
    return send_from_directory('.', 'index.html')

@app.route('/unrated')
def unrated():
    return send_from_directory('.', 'index.html')

@app.route('/hall-of-fame')
def hall_of_fame():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    print("Flask server running at http://localhost:8000")
    print("This server supports proper routing for individual reviews!")
    app.run(host='0.0.0.0', port=8000, debug=True) 