import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailtemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to CHATTER",
    html: createWelcomeEmailTemplate(name, clientURL),
  });
  if (error) {
    return console.log("Email sending Error : ", { error });
  }

  console.log("Email sent successfully : ", { data });
};
