import express from "express";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors()); // Add this line to enable CORS

// Create MySQL connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT), 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


// Register Route
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const connection = await pool.getConnection();
    await connection.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [
      username,
      email,
      hashedPassword,
    ]);
    connection.release();
    res.json({ message: "ลงทะเบียนสำเร็จ" });
  } catch (err) {
    res.status(400).json({ error: "ผู้ใช้นี้มีอยู่แล้ว" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  const connection = await pool.getConnection();
  const [rows] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
  connection.release();

  if (rows.length === 0) {
    return res.status(401).json({ error: "ไม่พบผู้ใช้ในระบบ" });
  }

  const user = rows[0];
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
  }

  res.json({ message: "เข้าสู่ระบบสำเร็จ", user: { id: user.id, username: user.username, email: user.email } });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
