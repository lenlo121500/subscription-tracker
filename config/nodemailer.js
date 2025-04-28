import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASSWORD } from "./env.js";

export const accountEmail = EMAIL;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: accountEmail,
    pass: EMAIL_PASSWORD,
  },
});
