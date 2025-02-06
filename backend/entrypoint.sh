#!/bin/sh

# Check if vendor directory exists
if [ ! -d "vendor" ]; then
  composer install
fi

# Check if APP_KEY is set in .env
if ! grep -q "APP_KEY=" .env || grep -q "APP_KEY=$" .env; then
  php artisan key:generate
fi

# Run the main container command
exec "$@"