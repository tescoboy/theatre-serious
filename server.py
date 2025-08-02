#!/usr/bin/env python3
"""
Simple HTTP server for client-side routing
"""
import http.server
import socketserver
import os
from urllib.parse import urlparse

PORT = 8000

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        # List of static file extensions that should be served directly
        static_extensions = ['.js', '.css', '.html', '.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.eot']
        
        # Check if this is a static file request
        is_static_file = any(path.endswith(ext) for ext in static_extensions)
        
        # For static files, strip any route prefix (like /review/, /play/, etc.)
        # and check if the file exists in the root directory
        if is_static_file:
            # Extract the actual file path by removing route prefixes
            # e.g., /review/src/styles/custom-bootstrap.css -> /src/styles/custom-bootstrap.css
            parts = path.split('/')
            if len(parts) > 2 and parts[1] in ['review', 'play', 'reviews', 'plays']:
                # Remove the route prefix and reconstruct the path
                actual_path = '/' + '/'.join(parts[2:])
                if os.path.exists(actual_path[1:]):  # Remove leading slash
                    self.path = actual_path
                    super().do_GET()
                    return
            
            # If no route prefix or file doesn't exist, check the original path
            if os.path.exists(path[1:]):  # Remove leading slash
                super().do_GET()
                return
        
        # For all other requests, serve index.html for client-side routing
        self.path = '/index.html'
        super().do_GET()

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        print("Static files served directly, all other routes serve index.html")
        httpd.serve_forever() 