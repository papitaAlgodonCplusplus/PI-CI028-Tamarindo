import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE email = ?"

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.json(err)
      console.log(data);
    if (data.length === 0) return res.status(404).json("Wrong email or password")
    const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password)
    
    if (isPasswordCorrect) return res.status(404).json("Wrong email or password")
      
      const token = jwt.sign({ id: data[0].id }, "jwtkey")
      const { password, ...other } = data[0]
      
      res.cookie("access_token", token, {
        httpOnly: true,
      }).status(200).json(other)
    })
    // console.log(err);
}
