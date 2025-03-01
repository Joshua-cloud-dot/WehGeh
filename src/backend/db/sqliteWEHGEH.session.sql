

-- TABLES

CREATE TABLE Mitbewohner(
    MitName Varchar(30) PRIMARY KEY)


CREATE TABLE Raum(
    Bezeichnung Varchar(40) PRIMARY KEY)
    


CREATE TABLE Reinigung(
    MitName Varchar(30) ,
    RaumBez Varchar(40) ,
    Kalenderwoche INT,
    Erledigt INT,
    FOREIGN KEY(MitName) REFERENCES Mitbewohner(MitName),
    FOREIGN KEY(RaumBez) REFERENCES Raum(Bezeichnung),
    PRIMARY KEY(MitName, RaumBez, Kalenderwoche))

DROP TABLE Reinigung

DROP TABLE Reinigung
DROP TABLE Mitbewohner
DROP TABLE Raum


-- Mit Werten Befüllen

INSERT INTO Mitbewohner(MitName) VALUES ('Karol');
INSERT INTO Mitbewohner(MitName) VALUES ('Konstantin');
INSERT INTO Mitbewohner(MitName) VALUES ('Joshua');

INSERT INTO Raum(Bezeichnung) VALUES ('Wohnzimmer');
INSERT INTO Raum(Bezeichnung) VALUES ('Küche');
INSERT INTO Raum(Bezeichnung) VALUES ('Bäder');

INSERT INTO Reinigung (MitName, RaumBez, Kalenderwoche, Erledigt)
VALUES (
    'Joshua',
    'Bäder',
    6,
    0
  );

Delete FROM Reinigung

SELECT * FROM Mitbewohner;
SELECT * FROM Raum
SELECT * FROM Reinigung;


Begin TRANSACTION
DELETE FROM Reinigung WHERE RaumBez LIKE ""
commit

SELECT Erledigt FROM Reinigung WHERE Kalenderwoche=6 AND RaumBez = 'Bäder' AND MitName='Joshua'
UPDATE Reinigung SET Erledigt=FALSE

UPDATE Reinigung SET Erledigt=TRUE 
    WHERE MitName = 'Joshua'
    AND RaumBez = 'Bäder'
    AND Kalenderwoche = 7;


INSERT INTO Reinigung (MitName, RaumBez, Kalenderwoche, Erledigt)
SELECT 