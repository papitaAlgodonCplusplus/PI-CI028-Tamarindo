/*From here new queries*/
delete from hotel.images;
delete from hotel.reservations;
delete from hotel.rooms;

alter table hotel.images
add column room_id int;

alter table hotel.rooms
DROP CONSTRAINT rooms_ibfk_2;

alter table hotel.rooms
drop column image_id;

ALTER TABLE hotel.images
ADD CONSTRAINT rooms_imgs_ibfk_1
FOREIGN KEY (room_id)
REFERENCES hotel.rooms(roomid);

alter table hotel.users
ADD COLUMN imageid INT;

ALTER TABLE hotel.users
ADD CONSTRAINT users_imgs_ibfk_1
FOREIGN KEY (imageid)
REFERENCES hotel.images(imageid);
