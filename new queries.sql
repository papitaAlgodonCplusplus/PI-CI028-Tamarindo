SELECT * FROM hotel.services_log;
SELECT * FROM hotel.services;
SELECT * FROM hotel.reservations;
SELECT * from hotel.categories;

INSERT INTO hotel.users(userid, name, last_name, email, password, rol, image_id) VALUES (3, 'Alex', 'Quesada', 'alexquesada24@gmail.com', '$10$aa2fg5WyfDgKLvOnWte89OwiImvhiUKxhnGBcZeXNHaGqZK01ijR2', 'admin', 19);
SELECT * FROM users;
SELECT * FROM images;
delete from images;
insert into hotel.categories(class_name, price) values ('Deluxe', 700000);
SELECT * from categories;
SELECT * FROM rooms;
SELECT * FROM rooms LEFT JOIN images ON rooms.image_id = images.imageid;

DELETE FROM hotel.reservations;
DELETE FROM hotel.users;
DELETE FROM hotel.services_log;
delete from hotel.rooms;

SELECT * from hotel.users;

ALTER TABLE hotel.users
ADD COLUMN image_id int;

ALTER TABLE hotel.users
ADD CONSTRAINT fk_image_id
FOREIGN KEY (image_id)
REFERENCES hotel.images(imageid);

select * from hotel.rooms;

alter table hotel.users
add column phone varchar(50);

ALTER TABLE hotel.users
DROP CONSTRAINT fk_image_id;

ALTER TABLE images
DROP COLUMN description;