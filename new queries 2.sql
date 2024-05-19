/*From here new queries*/
delete from hotel.images;
delete from hotel.reservations;
delete from hotel.rooms;

alter table hotel.images
add column room_id int;
select * from hotel.rooms;
DELETE FROM hotel.rooms WHERE roomid = 25;
DELETE FROM reservations WHERE id_room = 27;
DELETE FROM rooms WHERE roomid = 27;
select * from hotel.reservations;
DELETE FROM hotel.reservations WHERE id_room = 25;
alter table hotel.rooms
drop constraint rooms_ibfk_2;

alter table hotel.rooms
drop column image_id;

ALTER TABLE hotel.images
ADD CONSTRAINT rooms_imgs_ibfk_1
FOREIGN KEY (room_id)
REFERENCES hotel.rooms(roomid);