import http.server
import socketserver
import subprocess
from livereload import Server
import threading

HTTP_PORT = 8000
LIVERELOAD_PORT = 35729


class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/generate":
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            try:
                result = subprocess.run(["web.exe"], capture_output=True, text=True)
                self.wfile.write(result.stdout.encode())
            except Exception as e:
                self.wfile.write(f"Error: {e}".encode())
        else:
            super().do_GET()

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()


Handler = CustomHandler


def start_http_server():
    with socketserver.TCPServer(("", HTTP_PORT), Handler) as httpd:
        print(f"Serving at port {HTTP_PORT}")
        httpd.serve_forever()


def start_livereload_server():
    server = Server()
    server.watch("*.html")  # Watch for changes in HTML files
    server.watch("*.css")  # Watch for changes in CSS files
    server.watch("*.py")  # Watch for changes in Python files
    server.watch("web.exe")  # Watch for changes in the executable
    server.serve(root=".", port=LIVERELOAD_PORT)


if __name__ == "__main__":
    # Start the HTTP server in a separate thread
    http_thread = threading.Thread(target=start_http_server)
    http_thread.daemon = True
    http_thread.start()

    # Start the livereload server in the main thread
    start_livereload_server()
