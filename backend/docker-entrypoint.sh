#!/bin/sh
set -e

php artisan migrate --force

if [ "$SEED_ON_BOOT" = "true" ]; then
    php artisan db:seed --force
fi

exec php artisan serve --host=0.0.0.0 --port=8000
