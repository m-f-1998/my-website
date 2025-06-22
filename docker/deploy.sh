# Write a shell script for stop, start, and kill the docker container locally
#!/bin/bash
set -e
ACTION=$1

if [ -z "$ACTION" ]; then
  echo "Usage: $0 {start|stop|kill}"
  exit 1
fi
case $ACTION in
  start)
    echo "Starting Docker container..."
    docker-compose up -d || echo "Container already running or does not exist."
    echo "Container started"
    ;;
  stop)
    echo "Stopping Docker container..."
    docker-compose down || echo "Container not running or does not exist."
    echo "Container stopped."
    ;;
  restart)
    echo "Restarting Docker container..."
    docker-compose restart || echo "Container not running or does not exist."
    echo "Container restarted."
    ;;
  kill)
    echo "Killing Docker container..."
    docker-compose down -v || echo "Container not running or does not exist."
    echo "Container and image removed."
    ;;
  *)
    echo "Invalid action: $ACTION. Use start, stop, or kill."
    exit 1
    ;;
esac
echo "Action '$ACTION' completed successfully."