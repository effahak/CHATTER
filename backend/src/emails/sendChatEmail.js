import nodemailer from "nodemailer";
import { ENV } from "../lib/env.js";

const transporter = nodemailer.createTransport({
  service: ENV.EMAIL_SERVICE || "gmail",
  auth: {
    user: ENV.EMAIL,
    pass: ENV.PASSWORD,
  },
});

export const sendMessageEmail = async (to, senderName) => {
  if (!to) return console.error(" No recipient email provided.");

  await transporter.sendMail({
    from: `"Chat App" <${ENV.EMAIL}>`,
    to,
    subject: `New message from ${senderName}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>You've got a new message 💬</h2>
        <p><strong>${senderName}</strong> just sent you a message.</p>
        <p><a href=${ENV.CLIENT_URL} style="color:#0ea5e9;">Open your chat to view it.</a></p>
      </div>
    `,
  });
};
