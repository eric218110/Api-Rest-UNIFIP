import nodemailer from "nodemailer";
import path from "path";
import dotenv from "dotenv";
import handlebars from "nodemailer-express-handlebars";

const { MAILER_HOST, MAILER_PORT, MAILER_USER, MAILER_PASS } = process.env;

const transport = nodemailer.createTransport({
  host: MAILER_HOST,
  port: MAILER_PORT,
  auth: {
    user: MAILER_USER,
    pass: MAILER_PASS,
  },
});

transport.use(
  "compiler",
  handlebars({
    viewEngine: "handlebars",
    viewPath: path.resolve("src", "resources", "mail"),
    extName: ".html",
  })
);

export default transport;
