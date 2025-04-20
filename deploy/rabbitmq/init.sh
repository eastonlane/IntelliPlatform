#!/bin/sh

echo "Enabling MQTT plugins..."
rabbitmq-plugins enable --offline rabbitmq_mqtt

# Start RabbitMQ in background
echo "Starting RabbitMQ in background..."
rabbitmq-server -detached

# Wait until RabbitMQ is ready
sleep 10

# Read password from file
RABBIT_USR=$(cat /run/secrets/rabbitmq_client_usr)
RABBIT_PWD=$(cat /run/secrets/rabbitmq_client_pwd)

# Optional: create vhost
rabbitmqctl add_vhost iot

# Add user with password from file
rabbitmqctl add_user "$RABBIT_USR" "$RABBIT_PWD"

# Set permissions for user (on vhost)
rabbitmqctl set_permissions -p iot "$RABBIT_USR" ".*" ".*" ".*"

echo "Setup complete. Restarting RabbitMQ in foreground..."
rabbitmqctl stop
exec rabbitmq-server
