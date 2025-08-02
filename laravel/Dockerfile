# Stage 1: Build
FROM dunglas/frankenphp:php8.2

WORKDIR /app

ENV SERVER_NAME=":8000"

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libicu-dev \
    && docker-php-ext-install pdo_mysql zip exif pcntl bcmath gd intl

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . .

# Install dependencies
RUN composer install

# Set permissions for storage
RUN chown -R www-data:www-data storage bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache

# Create symbolic link for storage
RUN php artisan storage:link

# # Expose port 8000
# EXPOSE 8000

# # Start FrankenPHP
# CMD ["frankenphp", "run"]
