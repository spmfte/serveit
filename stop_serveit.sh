#!/bin/bash

# Kill the process using the saved PID
if [ -f serveit.pid ]; then
  kill $(cat serveit.pid) && rm serveit.pid
else
  echo "PID file not found. Is the server running?"
fi

