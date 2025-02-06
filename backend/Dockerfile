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
    libmariadb-dev

# Install PDO MySQL extension
RUN docker-php-ext-install pdo_mysql

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www

# Copy the rest of the application code
COPY src/ .

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/

# Give execution rights to the entrypoint script
RUN chmod +x /usr/local/bin/entrypoint.sh

# Create storage and cache directories if they don't exist
RUN mkdir -p /var/www/storage /var/www/bootstrap/cache

# Set permissions for storage and cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

ENTRYPOINT ["entrypoint.sh"]
