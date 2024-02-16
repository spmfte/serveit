#!/bin/bash

# Build the Rust project
cargo build --release

# Run the application with the specified directory
./target/release/serveit "$1"

# Open the base URL in the default browser
open "http://127.0.0.1:5001/files/"

