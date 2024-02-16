#!/bin/bash

# Build the Rust project
cargo build --release

# Run the application with the specified directory in the background
./target/release/serveit "$1" &

# Wait for the server to start
sleep 2

# Open the base URL in the default browser
open "http://127.0.0.1:5001/files/"

# Bring the Rust application back to the foreground (optional)
fg
