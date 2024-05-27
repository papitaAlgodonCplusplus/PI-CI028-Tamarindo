/*From here new queries*/
delete from hotel.images;
delete from hotel.reservations;
delete from hotel.rooms;

alter table hotel.images
add column room_id int;
alter table hotel.rooms
drop constraint rooms_ibfk_2;

alter table hotel.rooms
drop column image_id;

ALTER TABLE hotel.images
ADD CONSTRAINT rooms_imgs_ibfk_1
FOREIGN KEY (room_id)
REFERENCES hotel.rooms(roomid);