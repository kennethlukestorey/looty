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

-- Create table for item categories
CREATE TABLE ItemCategories (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

-- Adjust the Items table to include a category_id and rarity
ALTER TABLE Items
ADD COLUMN category_id INT,
ADD COLUMN rarity VARCHAR(255) NOT NULL,
ADD FOREIGN KEY (category_id) REFERENCES ItemCategories(id);

-- Create table for container content templates
CREATE TABLE ContainerContentTemplates (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

-- Create table for defining content rules in templates (e.g., 2 money items, 1 weapon)
CREATE TABLE ContentRules (
    template_id INT,
    category_id INT,
    quantity INT NOT NULL,
    PRIMARY KEY (template_id, category_id),
    FOREIGN KEY (template_id) REFERENCES ContainerContentTemplates(id),
    FOREIGN KEY (category_id) REFERENCES ItemCategories(id)
);

-- Adjust the Containers table to reference a content template
ALTER TABLE Containers
ADD COLUMN content_template_id INT,
ADD FOREIGN KEY (content_template_id) REFERENCES ContainerContentTemplates(id);

-- View for Item Details with Genre Profiles
CREATE VIEW ItemDetailsWithGenres AS
SELECT 
    Items.id AS ItemID, 
    Items.name AS ItemName, 
    Items.details AS ItemDetails, 
    GenreProfiles.name AS GenreName
FROM 
    Items
JOIN 
    ItemGenreProfiles ON Items.id = ItemGenreProfiles.item_id
JOIN 
    GenreProfiles ON ItemGenreProfiles.genre_profile_id = GenreProfiles.id;

-- View for Container Details with Genre Profiles
CREATE VIEW ContainerDetailsWithGenres AS
SELECT 
    Containers.id AS ContainerID, 
    Containers.name AS ContainerName, 
    Containers.details AS ContainerDetails, 
    GenreProfiles.name AS GenreName
FROM 
    Containers
JOIN 
    ContainerGenreProfiles ON Containers.id = ContainerGenreProfiles.container_id
JOIN 
    GenreProfiles ON ContainerGenreProfiles.genre_profile_id = GenreProfiles.id;

-- View for Items in Containers
CREATE VIEW ItemsInContainers AS
SELECT 
    Containers.id AS ContainerID, 
    Containers.name AS ContainerName, 
    Items.id AS ItemID, 
    Items.name AS ItemName
FROM 
    Containers
JOIN 
    ItemContainer ON Containers.id = ItemContainer.container_id
JOIN 
    Items ON ItemContainer.item_id = Items.id;

-- View for Containers with Item Count
CREATE VIEW ContainerWithItemCount AS
SELECT 
    Containers.id AS ContainerID, 
    Containers.name AS ContainerName, 
    COUNT(ItemContainer.item_id) AS ItemCount
FROM 
    Containers
LEFT JOIN 
    ItemContainer ON Containers.id = ItemContainer.container_id
GROUP BY 
    Containers.id;


-- Adjust the Items table to include common attributes from all categories
ALTER TABLE Items
ADD COLUMN weight DECIMAL(10, 2),
ADD COLUMN value DECIMAL(10, 2),
ADD COLUMN type VARCHAR(50) NOT NULL;

-- Create tables for category-specific attributes

-- Guns specific attributes
CREATE TABLE GunDetails (
    item_id INT PRIMARY KEY,
    range INT,
    damage INT,
    accuracy INT,
    special TEXT,
    FOREIGN KEY (item_id) REFERENCES Items(id)
);

-- Equipment specific attributes
CREATE TABLE EquipmentDetails (
    item_id INT PRIMARY KEY,
    slot VARCHAR(50),
    modifiers TEXT,
    special TEXT,
    FOREIGN KEY (item_id) REFERENCES Items(id)
);

-- Medical specific attributes
CREATE TABLE MedicalDetails (
    item_id INT PRIMARY KEY,
    healing INT,
    uses INT,
    special TEXT,
    FOREIGN KEY (item_id) REFERENCES Items(id)
);

-- Since JUNK and MONEY categories do not have additional attributes beyond what's already in Items,
-- no additional tables are created for them. However, you can still distinguish them using the `type` column in Items.

-- Note: If in the future, JUNK or MONEY categories require unique attributes, you can create tables similar to the ones above.