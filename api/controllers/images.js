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
    SELECT users.*, images.*
    FROM users
    LEFT JOIN images ON users.image_id = images.imageid
    WHERE users.userid = ?
  `;

  db.query(q, [req.params.userID], (err, result) => {
    if (err) {
      return res.status(500);
    }

    return res.status(200).json(result);
  });
};
