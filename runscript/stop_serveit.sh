#!/usr/bin/env bash

PID_FILE="serveit.pid"

# Check if the PID file exists and is not empty
if [ -s $PID_FILE ]; then
    PID=$(cat $PID_FILE)

    # Check if the process with this PID exists
    if ps -p $PID > /dev/null; then
       echo "Stopping serveit server with PID $PID"
       kill $PID

       # Wait a moment and then check if the process was successfully killed
       sleep 1
       if ps -p $PID > /dev/null; then
          echo "Server could not be stopped. You might need to kill it manually."
       else
          echo "Server stopped successfully."
       fi
    else
       echo "No running serveit server was found with PID $PID."
    fi

    # Optionally, remove the PID file
    rm $PID_FILE
else
    echo "PID file does not exist or is empty. Server might not be running."
fi

killall serveit
