import { db } from "../db.js";
import multer from "multer";

export const addService = (req, res) => {
  const q = "SELECT * FROM services WHERE service_name = ?";
  db.query(q, [req.body.title], (err, data) => {
    if (err) {
      return res.json(err);
    }
    if (data.length) {
      return res.status(409).json("Amenity already exists!");
    }

    const q = "INSERT INTO services(`service_name`, `service_price`, `image_path`) VALUES (?)"
    const values = [
      req.body.title,
      req.body.fee,
      req.body.file_path
    ]
    db.query(q, [values], (err, data) => {
      if (err) {
        return res.json(err);
      }
      return res.status(200);
    })
  })
}

export const addToServiceLog = (req, res) => {
  const q = "INSERT INTO services_log(`service_id`, `reservation_id`) VALUES (?)"
  const values = [
    req.body.service_id,
    req.body.reservation_id,
  ]
  db.query(q, [values], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.status(200);
  })
}

export const updateAmenity = (req, res) => {
  const updateQuery = `
    UPDATE services
    SET service_name = ?, service_price = ?, image_path = ?
    WHERE serviceid = ?
  `;

  db.query(updateQuery, [req.body.title, req.body.fee, req.body.file_path, req.body.service_id], (error, results) => {
    if (error) {
      return res.status(500).send("Error updating amenity");
    }

    if (results.affectedRows === 0) {
      return res.status(404).send("Amenity not found");
    }

    return res.status(200);
  });
}

export const updateServices = (req, res) => {
  const q = 'SELECT * FROM services';
  db.query(q, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch services from the database.' });
    }

    return res.status(200).json(result);
  });
};

export const getService = (req, res) => {
  const q = 'SELECT * FROM services WHERE service_name = ?';
  db.query(q, [req.params.serviceName], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch service from the database.' });
    }

    return res.status(200).json(result);
  });
};

export const deleteService = (req, res) => {
  const serviceID = req.params.serviceID;
  const q = "DELETE FROM services WHERE serviceid = ?";

  db.query(q, [serviceID], (err, data) => {
    if (err) {
      if (err.errno === 1451) {
        return res.status(415).json({ error: "Error: This amenity is already in a reservation" });
      }
      return res.status(500).json({ error: "Error: Couldn't delete service." });
    }

    return res.status(200);
  });
};

export const getSumByReservationID = (req, res) => {
  const reservationID = req.params.reservationID;
  const getServiceIDsQuery = `
    SELECT service_id
    FROM services_log
    WHERE reservation_id = ?
  `;

  db.query(getServiceIDsQuery, [reservationID], (error, results) => {
    if (error) {
      res.status(500).send("Error retrieving service IDs");
      return;
    }

    const serviceIDs = results.map(result => result.service_id);
    if (serviceIDs.length === 0) {
      res.json({ totalServicePrice: 0 });
      return;
    }

    const getServicePricesQuery = `
      SELECT service_price
      FROM services
      WHERE serviceid IN (?)
    `;

    db.query(getServicePricesQuery, [serviceIDs], (error, results) => {
      if (error) {
        res.status(500).send("Error retrieving service prices");
        return;
      }

      const totalServicePrice = results.reduce((total, result) => total + result.service_price, 0);
      res.json({ totalServicePrice });
    });
  });
};