#!/usr/bin/env bash
# Navigate to the project directory
cd /Users/aidan/projects/serveit || exit

# Build the Rust project
cargo build --release

# Run the application in the background and save the PID
./target/release/serveit "$1" & echo $! > serveit.pid

# Wait for the server to start
sleep 2

# Open the base URL in the default browser
open "http://127.0.0.1:3030/files/"

