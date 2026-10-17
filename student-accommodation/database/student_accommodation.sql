CREATE DATABASE IF NOT EXISTS student_accommodation;

USE student_accommodation;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15)
);

CREATE TABLE properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    gender ENUM('Male', 'Female', 'Any') NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0,
    image VARCHAR(255),
    description TEXT
);

CREATE TABLE amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE property_amenities (
    property_id INT,
    amenity_id INT,

    PRIMARY KEY (property_id, amenity_id),

    FOREIGN KEY (property_id)
        REFERENCES properties(id)
        ON DELETE CASCADE,

    FOREIGN KEY (amenity_id)
        REFERENCES amenities(id)
        ON DELETE CASCADE
);

CREATE TABLE interested_users (
    user_id INT,
    property_id INT,

    PRIMARY KEY (user_id, property_id),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (property_id)
        REFERENCES properties(id)
        ON DELETE CASCADE
);