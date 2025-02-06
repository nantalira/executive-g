FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    unzip \
    curl \
    git \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    zlib1g-dev \
    libzip-dev \
    libmariadb-dev  # Ganti dengan libmariadb-dev

# Install PDO MySQL extension
RUN docker-php-ext-install pdo_mysql

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www

# Copy composer files
COPY composer.json composer.lock ./

# Install PHP dependencies if not already installed
RUN if [ ! -d "vendor" ]; then composer install; fi

# Copy the rest of the application code
COPY . .

# Set permissions for storage and cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Generate application key if not already generated
RUN if [ ! -f ".env" ] || ! grep -q "APP_KEY=" .env; then php artisan key:generate; fi
