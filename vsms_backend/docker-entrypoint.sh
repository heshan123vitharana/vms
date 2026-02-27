#!/bin/bash
set -e

# Run migrations
php artisan migrate --force || true

# Seed database if empty
php artisan db:seed --force || true

# Update Apache port to match Render's PORT env
if [ ! -z "$PORT" ]; then
    sed -i "s/Listen 80/Listen $PORT/g" /etc/apache2/ports.conf
    sed -i "s/:80/:$PORT/g" /etc/apache2/sites-available/000-default.conf
fi

# Start Apache
exec apache2-foreground
