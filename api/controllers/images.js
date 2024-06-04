import { db } from "../db.js";

export const retrieveImages = (req, res) => {
  const q = 'SELECT * FROM images';
  db.query(q, (err, result) => {
    if (err) {
      return res.status(500);
    }

    return res.status(200).json(result);
  });
};

export const addImage = (req, res) => {
  const qi = "INSERT INTO images(`filename`, `filepath`) VALUES (?)"
  const filepath = "client/public/upload/" + req.body.filename;

  const values_0 = [
    req.body.filename,
    filepath
  ]
  db.query(qi, [values_0], (err, data) => {
    if (err) return res.json(err);

    return res.status(200)
  })
};

export const geImageByRoomID = (req, res) => {
  const q = 'SELECT * FROM images WHERE room_id = ?';
  db.query(q, [req.params.roomID], (err, result) => {
    if (err) {
      return res.status(500);
    }

    return res.status(200).json(result);
  });
};

export const geImageByID = (req, res) => {
  const q = 'SELECT * FROM images WHERE imageid = ?';
  db.query(q, [req.params.imageID], (err, result) => {
    if (err) {
      return res.status(500);
    }

    return res.status(200).json(result);
  });
};

export const geImageByUserID = (req, res) => {
  const q = `
    SELECT images.*
    FROM images
    INNER JOIN users ON users.imageid = images.imageid
    WHERE users.userid = ?
  `;

  db.query(q, [req.params.userID], (err, result) => {
    if (err) {
      return res.status(500);
    }

    return res.status(200).json(result);
  });
};
