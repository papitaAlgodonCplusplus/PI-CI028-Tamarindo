import { db } from "../db.js";

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


export const retrieveImages = (req, res) => {
  const q = 'SELECT * FROM images';
  db.query(q, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch images from the database.' });
    }

    return res.status(200).json(result);
  });
};


export const geImageByID = (req, res) => {
  const q = 'SELECT * FROM images WHERE imageid = ?';
  db.query(q, [req.params.imageID], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch images from the database.' });
    }

    return res.status(200).json(result);
  });
};

export const geImageByFilename = (req, res) => {
  const q = 'SELECT * FROM images WHERE filename = ?';
  console.log(req.params.filename)
  db.query(q, [req.params.filename], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch images from the database.' });
    }

    return res.status(200).json(result);
  });
};