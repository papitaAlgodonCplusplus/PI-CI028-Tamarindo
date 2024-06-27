import { db } from "../db.js";
import multer from "multer";

export const addRoomType = (req, res) => {
  const q = "INSERT INTO categories(`class_name`, `price`) VALUES (?, ?)";
  const values = [req.body.room_type_name, req.body.room_type_price];

  db.query(q, values, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
};

export const updateRoomTypes = (req, res) => {
  const q = "SELECT * FROM categories";
  db.query(q, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch categories from the database." });
    }

    return res.status(200).json(result);
  });
};

export const updateRoomTypesByID = (req, res) => {
  const roomTypeID = req.params.roomTypeID;
  const q = "SELECT * FROM categories WHERE categoryid = ?";
  db.query(q, [roomTypeID], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch categories from the database." });
    }

    return res.status(200).json(result);
  });
};

export const deleteRoomType = (req, res) => {
  console.log("Hello");
  const roomTypeID = req.params.id;
  console.log(roomTypeID);
  const q = "DELETE FROM categories WHERE categoryid = ?";

  db.query(q, [roomTypeID], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500);
    }

    return res.status(200);
  });
};

export const updateRoom = (req, res) => {
  const updateQuery = `
    UPDATE rooms
    SET title = ?, description = ?, image_id = ?, type_of_room = ?
    WHERE roomid = ?
  `;

  db.query(
    updateQuery,
    [
      req.body.title,
      req.body.description,
      req.body.image_id,
      req.body.type_of_room,
      req.body.id,
    ],
    (error, results) => {
      if (error) {
        return res.status(500).send("Error updating room");
      }

      if (results.affectedRows === 0) {
        return res.status(404).send("Room not found");
      }

      return res.status(200);
    }
  );
};

export const addRoom = (req, res) => {
  const q = "SELECT * FROM rooms WHERE title = ?";
  let roomID = null;
  db.query(q, [req.body.name], (err, data) => {
    if (err) {
      return res.json(err);
    }
    if (data.length) {
      return res.status(409).json("Room already exists!");
    }

    const q =
      "INSERT INTO rooms(`title`, `description`, `type_of_room`) VALUES (?)";
    const values = [req.body.name, req.body.desc, req.body.room_type];

    db.query(q, [values], (err, data) => {
      if (err) {
        return res.json(err);
      }
      roomID = data.insertId;

      console.log(roomID);
      const qi =
        "INSERT INTO images(`filename`, `filepath`, `room_id`) VALUES ?";
      const filenames = req.body.filenames;

      const values2 = filenames.map((filename) => [
        filename,
        "client/public/upload/" + filename,
        roomID,
      ]);

      db.query(qi, [values2], (err, data) => {
        if (err) return res.json(err);
      });

      return res.status(200);
    });
  });
};

export const updateRooms = (req, res) => {
  const q = `
  SELECT 
  r.*, 
  i.imageid, 
  i.filename, 
  i.filepath, 
  i.uploaded_at
FROM 
  hotel.rooms r
LEFT JOIN (
  SELECT 
      t1.imageid, 
      t1.filename, 
      t1.filepath, 
      t1.uploaded_at, 
      t1.room_id
  FROM 
      hotel.images t1
  INNER JOIN (
      SELECT 
          MIN(imageid) AS min_imageid, 
          room_id
      FROM 
          hotel.images
      GROUP BY 
          room_id
  ) t2 
  ON 
      t1.imageid = t2.min_imageid
) i 
ON 
  r.roomid = i.room_id;`;
  db.query(q, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch rooms from the database." });
    }

    return res.status(200).json(result);
  });
};

export const updateRoomsByID = (req, res) => {
  const roomID = req.params.roomID;
  const q =
    "SELECT r.*, i.imageid, i.filename, i.filepath, i.uploaded_at FROM hotel.rooms r LEFT JOIN ( SELECT t1.imageid, t1.filename, t1.filepath, t1.uploaded_at, t1.room_id FROM hotel.images t1 INNER JOIN ( SELECT MIN(imageid) AS min_imageid, room_id FROM hotel.images GROUP BY room_id ) t2 ON t1.imageid = t2.min_imageid ) i ON r.roomid = i.room_id WHERE r.roomid = ?;";
  db.query(q, [roomID], (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Failed to fetch rooms from the database." });
    }

    return res.status(200).json(result);
  });
};

export const getImagesFilenames = (req, res) => {
  const q = "SELECT * FROM images";
  db.query(q, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch rooms from the database." });
    }

    return res.status(200).json(result);
  });
};

export const searchImages = (req, res) => {
  const q = "SELECT * FROM images";
  db.query(q, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch filenames from the database." });
    }

    return res.status(200).json(result);
  });
};

export const deleteRoom = (req, res) => {
  const roomID = req.params.roomID;

  const getRoomImageIDQuery = "SELECT imageid FROM images WHERE room_id = ?";
  const deleteImagesQuery = "DELETE FROM images WHERE imageid = ?";
  const checkReservationsQuery = "SELECT * FROM reservations WHERE id_room = ?";
  const deleteReservationsQuery = "DELETE FROM reservations WHERE id_room = ?";
  const deleteRoomQuery = "DELETE FROM rooms WHERE roomid = ?";

  db.query(getRoomImageIDQuery, [roomID], (err, roomData) => {
    if (err) {
      return res.status(500).json("Error retrieving room data.");
    }

    if (roomData.length === 0) {
      return res.status(404).json("Room not found.");
    }

    // Delete all images related to the room
    const deleteImagePromises = roomData.map((image) => {
      return new Promise((resolve, reject) => {
        db.query(deleteImagesQuery, [image.imageid], (err, imagesData) => {
          if (err) {
            return reject("Error deleting images.");
          }
          resolve();
        });
      });
    });

    Promise.all(deleteImagePromises)
      .then(() => {
        // Check if reservations exist for the room
        db.query(checkReservationsQuery, [roomID], (err, reservationsData) => {
          if (err) {
            return res.status(500).json("Error checking reservations.");
          }

          if (reservationsData.length > 0) {
            // Delete reservations related to the room if they exist
            db.query(
              deleteReservationsQuery,
              [roomID],
              (err, deleteResData) => {
                if (err) {
                  return res.status(500).json("Error deleting reservations.");
                }

                // Finally, delete the room
                db.query(deleteRoomQuery, [roomID], (err, roomData) => {
                  if (err) {
                    return res.status(500).json("Error deleting room.");
                  }

                  res.json("Room and its related data have been deleted!");
                });
              }
            );
          } else {
            // If no reservations, just delete the room
            db.query(deleteRoomQuery, [roomID], (err, roomData) => {
              if (err) {
                return res.status(500).json("Error deleting room.");
              }

              res.json("Room and its related data have been deleted!");
            });
          }
        });
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  });
};
