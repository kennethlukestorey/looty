-- Create table for genre profiles
CREATE TABLE GenreProfiles (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    details VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

-- Create table for items
CREATE TABLE Items (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    details VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

-- Create table for container profiles
CREATE TABLE Containers (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    details VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

-- Create junction table for items and genre profiles
CREATE TABLE ItemGenreProfiles (
    item_id INT,
    genre_profile_id INT,
    PRIMARY KEY (item_id, genre_profile_id),
    FOREIGN KEY (item_id) REFERENCES Items(id),
    FOREIGN KEY (genre_profile_id) REFERENCES GenreProfiles(id)
);

-- Create junction table for containers and genre profiles
CREATE TABLE ContainerGenreProfiles (
    container_id INT,
    genre_profile_id INT,
    PRIMARY KEY (container_id, genre_profile_id),
    FOREIGN KEY (container_id) REFERENCES Containers(id),
    FOREIGN KEY (genre_profile_id) REFERENCES GenreProfiles(id)
);

-- Create junction table for items and containers
CREATE TABLE ItemContainer (
    item_id INT,
    container_id INT,
    PRIMARY KEY (item_id, container_id),
    FOREIGN KEY (item_id) REFERENCES Items(id),
    FOREIGN KEY (container_id) REFERENCES Containers(id)
);