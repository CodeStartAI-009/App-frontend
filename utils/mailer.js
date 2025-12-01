// backend/utils/mailer.js
const nodemailer = require("nodemailer");

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 0;
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const FROM_EMAIL = process.env.FROM_EMAIL || `WalletWave <no-reply@walletwave.local>`;

/**
 * createTransporter - create a nodemailer transporter.
 * If SMTP config is missing, we create an Ethereal account for dev/testing.
 */
async function createTransporter() {
  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    // Real SMTP
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for other ports (587)
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  // Fallback: Ethereal test account (useful for local dev)
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Attach preview info to transporter for caller to log
  transporter.__ethereal = {
    user: testAccount.user,
    pass: testAccount.pass,
  };

  return transporter;
}

/**
 * sendMail(to, subject, html, text)
 * - to: string or array
 * - subject: string
 * - html: html string
 * - text: plain text (optional)
 */
async function sendMail(to, subject, html, text) {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: FROM_EMAIL,
      to,
      subject,
      text: text || undefined,
      html: html || undefined,
    };

    const info = await transporter.sendMail(mailOptions);

    // If using Ethereal, print preview URL
    if (transporter && transporter.__ethereal) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("Ethereal message preview URL:", previewUrl);
      console.log("Ethereal creds:", transporter.__ethereal);
    }

    // debug info
    console.log("Email sent:", info.messageId);
    return { ok: true, info };
  } catch (err) {
    console.error("sendMail error:", err);
    return { ok: false, error: err };
  }
}

module.exports = { sendMail };
