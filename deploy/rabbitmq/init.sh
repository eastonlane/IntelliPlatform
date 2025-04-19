#!/bin/sh

echo "Enabling MQTT plugins..."
rabbitmq-plugins enable --offline rabbitmq_mqtt rabbitmq_web_mqtt

# Start RabbitMQ in background
echo "Starting RabbitMQ in background..."
rabbitmq-server -detached

# Wait until RabbitMQ is ready
sleep 10

# Read password from file
RABBIT_PWD=$(cat /run/secrets/rabbitmq_pwd)

# Optional: create vhost
rabbitmqctl add_vhost my_vhost

# Add user with password from file
rabbitmqctl add_user myuser "$RABBIT_PWD"

# Set permissions for user (on vhost)
rabbitmqctl set_permissions -p my_vhost myuser ".*" ".*" ".*"

# Make user administrator (optional)
rabbitmqctl set_user_tags myuser administrator

echo "Setup complete. Restarting RabbitMQ in foreground..."
rabbitmqctl stop
exec rabbitmq-server
