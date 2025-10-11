#!/bin/bash

# Infinite Match Privacy Policy Server Startup Script

echo "🎮 Starting Infinite Match Privacy Policy Server..."
echo ""

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    echo "Please install Python 3 to run the privacy policy server"
    exit 1
fi

# Check if privacy policy file exists
if [ ! -f "privacy-policy.html" ]; then
    echo "❌ Error: privacy-policy.html file not found!"
    echo "Make sure the privacy policy HTML file is in the same directory as this script."
    exit 1
fi

# Start the server
echo "🚀 Launching server..."
python3 server.py "$@"