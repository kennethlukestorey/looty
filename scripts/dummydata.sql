-- Insert genre profiles
INSERT INTO GenreProfiles (name, details) VALUES ('Swamp Dungeon', 'A murky and damp dungeon filled with dangerous creatures and hidden treasures.');

-- Insert items
INSERT INTO Items (name, details) VALUES ('Health Potion', 'Heals for 10 HP.');
INSERT INTO Items (name, details) VALUES ('Swamp Sword', 'Damage 2; A sword imbued with the power of the swamp.');
INSERT INTO Items (name, details) VALUES ('Mossy Shield', 'Defense 2; A shield covered in damp moss.');

-- Insert containers
INSERT INTO Containers (name, details) VALUES ('Wooden Crate', 'A wooden crate found in the swamp dungeon.');
INSERT INTO Containers (name, details) VALUES ('Mossy Chest', 'A mossy chest hidden deep within the swamp dungeon.');

-- Get the IDs of the inserted rows
SET @swampDungeonID = (SELECT id FROM GenreProfiles WHERE name = 'Swamp Dungeon');
SET @healthPotionID = (SELECT id FROM Items WHERE name = 'Health Potion');
SET @swampSwordID = (SELECT id FROM Items WHERE name = 'Swamp Sword');
SET @mossyShieldID = (SELECT id FROM Items WHERE name = 'Mossy Shield');
SET @woodenCrateID = (SELECT id FROM Containers WHERE name = 'Wooden Crate');
SET @mossyChestID = (SELECT id FROM Containers WHERE name = 'Mossy Chest');

-- Insert item-genre profile relationships
INSERT INTO ItemGenreProfiles (item_id, genre_profile_id) VALUES (@healthPotionID, @swampDungeonID);
INSERT INTO ItemGenreProfiles (item_id, genre_profile_id) VALUES (@swampSwordID, @swampDungeonID);
INSERT INTO ItemGenreProfiles (item_id, genre_profile_id) VALUES (@mossyShieldID, @swampDungeonID);

-- Insert container-genre profile relationships
INSERT INTO ContainerGenreProfiles (container_id, genre_profile_id) VALUES (@woodenCrateID, @swampDungeonID);
INSERT INTO ContainerGenreProfiles (container_id, genre_profile_id) VALUES (@mossyChestID, @swampDungeonID);

-- Insert item-container relationships
INSERT INTO ItemContainer (item_id, container_id) VALUES (@healthPotionID, @woodenCrateID);
INSERT INTO ItemContainer (item_id, container_id) VALUES (@swampSwordID, @mossyChestID);
INSERT INTO ItemContainer (item_id, container_id) VALUES (@mossyShieldID, @mossyChestID);