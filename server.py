#!/usr/bin/env python3
"""
Simple HTTP server to serve the Infinite Match Privacy Policy
"""

import http.server
import socketserver
import os
import webbrowser
from urllib.parse import urlparse

class PrivacyPolicyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL path
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Route to privacy policy
        if path == '/' or path == '/privacy' or path == '/privacy-policy':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            # Read and serve the privacy policy HTML file
            try:
                with open('privacy_policy.html', 'r', encoding='utf-8') as f:
                    content = f.read()
                self.wfile.write(content.encode('utf-8'))
            except FileNotFoundError:
                self.send_error(404, "Privacy policy file not found")
        else:
            # For any other path, return 404
            self.send_error(404, "Page not found")
    
    def log_message(self, format, *args):
        """Override to customize log format"""
        print(f"[{self.date_time_string()}] {format % args}")

def start_server(port=8080, host='localhost'):
    """Start the privacy policy server"""
    try:
        with socketserver.TCPServer((host, port), PrivacyPolicyHandler) as httpd:
            print(f"🚀 Privacy Policy Server started!")
            print(f"📄 Privacy Policy available at:")
            print(f"   http://{host}:{port}/")
            print(f"   http://{host}:{port}/privacy")
            print(f"   http://{host}:{port}/privacy-policy")
            print(f"\n🌐 Server running on {host}:{port}")
            print("Press Ctrl+C to stop the server")
            
            # Try to open the privacy policy in the default browser
            try:
                webbrowser.open(f'http://{host}:{port}/privacy')
            except:
                pass
            
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {port} is already in use. Trying port {port + 1}")
            start_server(port + 1, host)
        else:
            print(f"❌ Error starting server: {e}")
    except KeyboardInterrupt:
        print(f"\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    import sys
    
    # Parse command line arguments
    port = 8080
    host = 'localhost'
    
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Invalid port number. Using default port 8080.")
    
    if len(sys.argv) > 2:
        host = sys.argv[2]
    
    # Check if privacy policy file exists
    if not os.path.exists('privacy_policy.html'):
        print("❌ Error: privacy_policy.html file not found!")
        print("Make sure the privacy policy HTML file is in the same directory as this server script.")
        sys.exit(1)
    
    start_server(port, host)