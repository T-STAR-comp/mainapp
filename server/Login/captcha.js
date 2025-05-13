const express = require('express');
const fetch = require('node-fetch'); // if not available, install it: npm install node-fetch
const router = express.Router();

router.post("/", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token missing" });
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  try {
    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
      { method: "POST" }
    );

    const data = await verifyRes.json();

    if (data.success && data.score !== 0.0) {
      res.status(200).json({ success: true });
    } else {
      res.status(403).json({ success: false, errorCodes: data["error-codes"] });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

module.exports = router;
