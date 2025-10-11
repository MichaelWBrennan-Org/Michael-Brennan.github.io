# Infinite Match Privacy Policy Server

This directory contains the privacy policy for "Infinite Match" mobile game and a simple web server to make it accessible via URL.

## Files

- `privacy-policy.html` - Privacy policy in HTML format with styling
- `server.py` - Python web server to serve the privacy policy
- `start_privacy_server.sh` - Bash script to easily start the server
- `README.md` - This file

## Quick Start

### Option 1: Using the startup script (Recommended)
```bash
./start_privacy_server.sh
```

### Option 2: Using Python directly
```bash
python3 server.py
```

### Option 3: Specify custom port and host
```bash
python3 server.py 3000 0.0.0.0
```

## Accessing the Privacy Policy

Once the server is running, you can access the privacy policy at:

- `http://localhost:8080/`
- `http://localhost:8080/privacy`
- `http://localhost:8080/privacy-policy`

## Server Features

- **Multiple URL paths**: The privacy policy is accessible via multiple URL paths for flexibility
- **Auto-browser opening**: The server automatically opens the privacy policy in your default browser
- **Port conflict handling**: If port 8080 is busy, it automatically tries the next available port
- **Clean logging**: Shows access logs with timestamps
- **Error handling**: Graceful error handling for missing files and port conflicts

## Customization

### Changing the Port
```bash
python3 server.py 3000
```

### Making it accessible from other devices
```bash
python3 server.py 8080 0.0.0.0
```

### Stopping the Server
Press `Ctrl+C` in the terminal where the server is running.

## Requirements

- Python 3.x
- No additional packages required (uses only standard library)

## Privacy Policy Content

The privacy policy includes all standard sections required for mobile games on Google Play Store:

- Information collection and usage
- Data sharing and disclosure
- User rights and choices
- Children's privacy protection
- International data transfers
- Regional compliance (GDPR, CCPA, LGPD)
- Contact information
- Security measures

## For Production Use

For production deployment, consider:

1. **HTTPS**: Use a reverse proxy like nginx with SSL certificates
2. **Domain**: Point a domain name to your server
3. **CDN**: Use a content delivery network for better performance
4. **Monitoring**: Add logging and monitoring for production use

## Example Production Setup

```bash
# Using nginx as reverse proxy
server {
    listen 443 ssl;
    server_name privacy.yourgame.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Support

If you need to modify the privacy policy content, edit the `privacy-policy.html` file and restart the server.