import { db } from "../db.js";

export const updateRoomType = (req, res) => {
  const updateQuery = `
    UPDATE categories
    SET class_name = ?, price = ?
    WHERE categoryid = ?
  `;

  db.query(updateQuery, [req.body.title, req.body.fee, req.body.categoryid], (error, results) => {
    if (error) {
      return res.status(500).send("Error updating room type");
    }

    if (results.affectedRows === 0) {
      return res.status(404).send("Room type not found");
    }

    return res.status(200);
  });
}

export const updateRoomTypes = (req, res) => {
  const q = 'SELECT * FROM categories';
  db.query(q, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch categories from the database.' });
    }

    return res.status(200).json(result);
  });
};

export const addRoomType = (req, res) => {
  const q = "INSERT INTO categories(`class_name`, `price`) VALUES (?, ?)";
  const values = [
    req.body.room_type_name,
    req.body.room_type_price,
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
};

export const updateRoomTypesByID = (req, res) => {
  const roomTypeID = req.params.roomTypeID;
  const q = 'SELECT * FROM categories WHERE categoryid = ?';
  db.query(q, [roomTypeID], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch categories from the database.' });
    }

    return res.status(200).json(result);
  });
};

export const deleteRoomType = (req, res) => {
  console.log(req)
  const roomID = req.params.roomID;
  const q = "DELETE FROM categories WHERE categoryid = ?";

  db.query(q, [roomID], (err, data) => {
    if (err) {
      return res.status(500);
    }

    return res.status(200);
  });
};
