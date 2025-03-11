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

// Save Note Route
app.post("/save-note", async (req, res) => {
  const { user_id, date, note } = req.body;
  if (!user_id || !date) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  try {
    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO notes (user_id, date, note) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE note = ?",
      [user_id, date, note, note]
    );
    connection.release();
    res.json({ message: "บันทึกโน้ตสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกโน้ต" });
  }
});

// Save Date Range Route
app.post("/save-date-range", async (req, res) => {
  const { user_id, start_date, end_date } = req.body;
  if (!user_id || !start_date || !end_date) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  try {
    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO date_ranges (user_id, start_date, end_date) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE start_date = ?, end_date = ?",
      [user_id, start_date, end_date, start_date, end_date]
    );
    connection.release();
    res.json({ message: "บันทึกช่วงเวลาเป็นประจำเดือนสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกช่วงเวลาเป็นประจำเดือน" });
  }
});

// Save or Update User Cycle Route
app.post("/save-cycle", async (req, res) => {
  const { user_id, cycle, cycleDays } = req.body;
  if (!user_id || !cycle || !cycleDays) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  try {
    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO user_cycles (user_id, cycle, cycleDays) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE cycle = ?, cycleDays = ?",
      [user_id, cycle, cycleDays, cycle, cycleDays]
    );
    connection.release();
    res.json({ message: "บันทึกข้อมูลรอบเดือนสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูลรอบเดือน", err });
  }
});

// Save DASS-21 Route
app.post("/save-dass21", async (req, res) => {
  const { user_id, period, responses } = req.body;
  if (!user_id || !period || !responses) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  const stressKeys = ["V", "AA", "AC", "AF", "AG", "AI", "AM"];
  const depressionKeys = ["X", "Z", "AE", "AH", "AK", "AL", "AP"];
  const anxietyKeys = ["W", "Y", "AB", "AD", "AJ", "AN", "AO"];

  const stressResponses = stressKeys.map(key => responses[key]);
  const depressionResponses = depressionKeys.map(key => responses[key]);
  const anxietyResponses = anxietyKeys.map(key => responses[key]);

  try {
    const mlApiUrl = "http://localhost:5555/predict";

    const stressPrediction = await fetch(mlApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: stressResponses, model: "model3" }),
    }).then(res => res.json());

    const depressionPrediction = await fetch(mlApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: depressionResponses, model: "model2" }),
    }).then(res => res.json());

    const anxietyPrediction = await fetch(mlApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: anxietyResponses, model: "model1" }),
    }).then(res => res.json());



    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO dass21 (user_id, period, responses, stress, depression, anxiety) VALUES (?, ?, ?, ?, ?, ?)",
      [
        user_id,
        period,
        JSON.stringify(responses),
        stressPrediction.prediction[0],
        depressionPrediction.prediction[0],
        anxietyPrediction.prediction[0],
        JSON.stringify(responses),
        stressPrediction.prediction[0],
        depressionPrediction.prediction[0],
        anxietyPrediction.prediction[0],
      ]
    );
    connection.release();
    res.json({ message: "บันทึก DASS-21 สำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึก DASS-21", err });
  }
});

// Save PSST-A Route
app.post("/save-psst", async (req, res) => {
  const { user_id, responses } = req.body;
  if (!user_id || !responses) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  // Calculate PMS and PMDD flags
  let pms = false;
  let pmdd = false;
  
  // Check PMDD first
  let countSevereIndex0to3 = 0;
  let countModerateOrSevereIndex0to13 = 0;
  let countSevereIndex14to18 = 0;
  
  // Count values for PMDD check
  for (let i = 0; i <= 3; i++) {
    if (responses[i] === "3") {
      countSevereIndex0to3++;
    }
  }
  
  for (let i = 0; i <= 13; i++) {
    if (responses[i] === "2" || responses[i] === "3") {
      countModerateOrSevereIndex0to13++;
    }
  }
  
  for (let i = 14; i <= 18; i++) {
    if (responses[i] === "3") {
      countSevereIndex14to18++;
    }
  }
  
  // Check if conditions for PMDD are met
  if (countSevereIndex0to3 >= 1 && countModerateOrSevereIndex0to13 >= 4 && countSevereIndex14to18 >= 1) {
    pmdd = true;
  } 
  // If not PMDD, check for PMS
  else {
    let countModerateOrSevereIndex0to3 = 0;
    let countModerateOrSevereIndex14to18 = 0;
    
    // Count values for PMS check
    for (let i = 0; i <= 3; i++) {
      if (responses[i] === "2" || responses[i] === "3") {
        countModerateOrSevereIndex0to3++;
      }
    }
    
    for (let i = 14; i <= 18; i++) {
      if (responses[i] === "2" || responses[i] === "3") {
        countModerateOrSevereIndex14to18++;
      }
    }

    // We already have countModerateOrSevereIndex0to13 from above
    if (countModerateOrSevereIndex0to3 >= 1 && countModerateOrSevereIndex0to13 >= 4 && countModerateOrSevereIndex14to18 >= 1) {
      pms = true;
    }
  }

  try {
    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO psst (user_id, responses, pms, pmdd) VALUES (?, ?, ?, ?)",
      [
        user_id,
        JSON.stringify(responses),
        pms,
        pmdd,
      ]
    );
    connection.release();
    res.json({ 
      message: "บันทึก PSST-A สำเร็จ",
      result: { pms, pmdd }
    });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึก PSST-A", err });
  }
});

// Save Symptom Tracking Route
app.post("/save-symptom-tracking", async (req, res) => {
  const { user_id, period, physicalSymptoms, emotionalSymptoms } = req.body;
  if (!user_id || !period) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  try {
    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO symptom_tracking (user_id, period, physicalSymptoms, emotionalSymptoms) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE physicalSymptoms = ?, emotionalSymptoms = ?",
      [
        user_id,
        period,
        JSON.stringify(physicalSymptoms),
        JSON.stringify(emotionalSymptoms),
        JSON.stringify(physicalSymptoms),
        JSON.stringify(emotionalSymptoms),
      ]
    );
    connection.release();
    res.json({ message: "บันทึกการติดตามอาการสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกการติดตามอาการ", err });
  }
});

// Fetch Notes Route
app.get("/notes/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM notes WHERE user_id = ?", [user_id]);
    connection.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลโน้ต" });
  }
});

// Fetch Date Ranges Route
app.get("/date-ranges/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM date_ranges WHERE user_id = ?", [user_id]);
    connection.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลช่วงเวลาเป็นประจำเดือน" });
  }
});

// Fetch DASS-21 Route
app.get("/dass21/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM dass21 WHERE user_id = ? ORDER BY created_at DESC", [user_id]);
    connection.release();
    if (rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูล DASS-21 สำหรับผู้ใช้นี้" });
    }

    const latestEntries = rows.reduce((acc, row) => {
      if (!acc[row.period]) {
        acc[row.period] = row;
      }
      return acc;
    }, {});

    const latestData = Object.values(latestEntries);

    res.json(latestData);
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล DASS-21" });
  }
});

// Fetch PSST Route
app.get("/psst/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM psst WHERE user_id = ? ORDER BY created_at DESC", [user_id]);
    connection.release();
    if (rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูล PSST สำหรับผู้ใช้นี้" });
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล PSST" });
  }
});

// Fetch User Cycle Route
app.get("/user-cycle/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT cycle, cycleDays FROM user_cycles WHERE user_id = ? ORDER BY created_at DESC", [user_id]);
    connection.release();
    if (rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลรอบเดือนสำหรับผู้ใช้นี้" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลรอบเดือน" });
  }
});

app.get("/notifications/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC", [user_id]);
    connection.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งเตือน" });
  }
});

// Save Notifications Route
app.post("/save-notifications", async (req, res) => {
  const { user_id, beforePeriod, duringPeriod, beforeDASS21, duringDASS21, afterDASS21, beforePSST } = req.body;
  if (!user_id) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  try {
    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO notifications (user_id, beforePeriod, duringPeriod, beforeDASS21, duringDASS21, afterDASS21, beforePSST) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE beforePeriod = ?, duringPeriod = ?, beforeDASS21 = ?, duringDASS21 = ?, afterDASS21 = ?, beforePSST = ?",
      [
        user_id,
        beforePeriod,
        duringPeriod,
        beforeDASS21,
        duringDASS21,
        afterDASS21,
        beforePSST,
        beforePeriod,
        duringPeriod,
        beforeDASS21,
        duringDASS21,
        afterDASS21,
        beforePSST,
      ]
    );
    connection.release();
    res.json({ message: "บันทึกการแจ้งเตือนสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกการแจ้งเตือน", err });
  }
});

// Save Notification Settings Route
app.post("/save-notification-settings", async (req, res) => {
  const { user_id, beforePeriod = false, duringPeriod = false, beforeDASS21 = false, duringDASS21 = false, afterDASS21 = false, beforePSST = false } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM notification_settings WHERE user_id = ?", [user_id]);

    if (rows.length === 0) {
      await connection.query(
        "INSERT INTO notification_settings (user_id, beforePeriod, duringPeriod, beforeDASS21, duringDASS21, afterDASS21, beforePSST) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [user_id, beforePeriod, duringPeriod, beforeDASS21, duringDASS21, afterDASS21, beforePSST]
      );
    } else {
      await connection.query(
        "UPDATE notification_settings SET beforePeriod = ?, duringPeriod = ?, beforeDASS21 = ?, duringDASS21 = ?, afterDASS21 = ?, beforePSST = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
        [beforePeriod, duringPeriod, beforeDASS21, duringDASS21, afterDASS21, beforePSST, user_id]
      );
    }

    connection.release();
    res.json({ message: "บันทึกการตั้งค่าการแจ้งเตือนสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกการตั้งค่าการแจ้งเตือน", details: err.message });
  }
});

// Fetch Notification Settings Route
app.get("/notification-settings/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM notification_settings WHERE user_id = ?", [user_id]);
    connection.release();
    if (rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลการตั้งค่าการแจ้งเตือนสำหรับผู้ใช้นี้" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลการตั้งค่าการแจ้งเตือน" });
  }
});

// Fetch Notifications Route
app.get("/notifications/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM notifications WHERE user_id = ?", [user_id]);
    connection.release();
    if (rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลการแจ้งเตือนสำหรับผู้ใช้นี้" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งเตือน" });
  }
});

// Fetch Symptom Tracking Route
app.get("/symptom-tracking/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM symptom_tracking WHERE user_id = ? ORDER BY created_at DESC", [user_id]);
    connection.release();
    if (rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลการติดตามอาการสำหรับผู้ใช้นี้" });
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลการติดตามอาการ" });
  }
});

// Fetch User Details Route
app.get("/user-details/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT username, email FROM users WHERE id = ?", [user_id]);
    connection.release();
    if (rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบผู้ใช้ในระบบ" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" });
  }
});

// Update Username Route
app.put("/update-username", async (req, res) => {
  const { user_id, new_username } = req.body;
  if (!user_id || !new_username) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  try {
    const connection = await pool.getConnection();
    await connection.query("UPDATE users SET username = ? WHERE id = ?", [new_username, user_id]);
    connection.release();
    res.json({ message: "อัปเดตชื่อผู้ใช้สำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตชื่อผู้ใช้" });
  }
});

// Fetch All Assessments Route
app.get("/all-assessments/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const connection = await pool.getConnection();
    const [dass21Rows] = await connection.query("SELECT created_at FROM dass21 WHERE user_id = ?", [user_id]);
    const [psstRows] = await connection.query("SELECT created_at FROM psst WHERE user_id = ?", [user_id]);
    const [symptomTrackingRows] = await connection.query("SELECT created_at FROM symptom_tracking WHERE user_id = ?", [user_id]);
    connection.release();

    const allAssessments = [
      ...dass21Rows.map(row => ({ type: 'dass21', date: row.created_at })),
      ...psstRows.map(row => ({ type: 'psst', date: row.created_at })),
      ...symptomTrackingRows.map(row => ({ type: 'symptom_tracking', date: row.created_at }))
    ];

    res.json(allAssessments);
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลการประเมินทั้งหมด" });
  }
});

// Fetch Assessments by Date Route
app.get("/assessments/:user_id/:date", async (req, res) => {
  const { user_id, date } = req.params;
  try {
    const connection = await pool.getConnection();
    const [dass21Rows] = await connection.query("SELECT * FROM dass21 WHERE user_id = ? AND DATE(created_at) = ?", [user_id, date]);
    const [psstRows] = await connection.query("SELECT * FROM psst WHERE user_id = ? AND DATE(created_at) = ?", [user_id, date]);
    const [symptomTrackingRows] = await connection.query("SELECT * FROM symptom_tracking WHERE user_id = ? AND DATE(created_at) = ?", [user_id, date]);
    connection.release();

    const assessments = {
      dass21: dass21Rows,
      psst: psstRows,
      symptomTracking: symptomTrackingRows
    };

    res.json(assessments);
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลการประเมิน" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
