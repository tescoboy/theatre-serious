from flask import Flask, send_from_directory
import os

app = Flask(__name__)

# Serve static files
@app.route('/src/<path:filename>')
def serve_static(filename):
    return send_from_directory('src', filename)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('.', 'favicon.ico')

# All routes serve index.html for simple SPA
@app.route('/')
@app.route('/<path:path>')
def serve_index(path=None):
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    print("Simple Flask server running at http://localhost:8000")
    print("No URL routing - just simple view switching")
    app.run(host='0.0.0.0', port=8000, debug=True) 