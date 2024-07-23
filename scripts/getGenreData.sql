DELIMITER //
CREATE PROCEDURE GetGenreData(IN genreID INT)
BEGIN
    SELECT 
        g.name AS GenreProfile,
        g.details AS GenreDetails,
        i.name AS Item,
        i.details AS ItemDetails,
        c.name AS Container,
        c.details AS ContainerDetails
    FROM 
        GenreProfiles g
    JOIN 
        ItemGenreProfiles igp ON g.id = igp.genre_profile_id
    JOIN 
        Items i ON igp.item_id = i.id
    JOIN 
        ItemContainer ic ON i.id = ic.item_id
    JOIN 
        Containers c ON ic.container_id = c.id
    JOIN 
        ContainerGenreProfiles cgp ON c.id = cgp.container_id
    WHERE 
        g.id = cgp.genre_profile_id AND g.id = genreID;
END //
DELIMITER ;