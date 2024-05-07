ALTER TABLE hotel.users
ADD COLUMN image_id int;

ALTER TABLE hotel.users
ADD CONSTRAINT fk_image_id
FOREIGN KEY (image_id)
REFERENCES hotel.images(imageid);

alter table hotel.users
add column phone varchar(50);

ALTER TABLE images
DROP COLUMN description;