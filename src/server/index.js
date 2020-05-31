import express from "express";
import dotEnv from "dotenv";
import bodyParser from "body-parser";
import chalk from "chalk";
import authController from "../app/controller/authController.js";
import projectController from "../app/controller/projectController.js";

dotEnv.config();

const appExpress = express();

const { PORT } = process.env;

appExpress.use(bodyParser.json());
appExpress.use(bodyParser.urlencoded({ extended: false }));
appExpress.use(authController);
appExpress.use(projectController);

appExpress.listen(PORT, () => {
  console.log(
    chalk.bgBlack.greenBright(
      "======================================================================"
    )
  );
  console.log(
    chalk.bgBlack.greenBright(
      "|    ___________       __           _________.__.__                  |"
    )
  );
  console.log(
    chalk.bgBlack.greenBright(
      "|    \\_   _____/______|__| ____    /   _____/|__|  |___  _______     |"
    )
  );
  console.log(
    chalk.bgBlack.greenBright(
      "|     |    __)_\\_  __ \\  |/ ___\\   \\_____  \\ |  |  |\\  \\/ /\\__  \\    |"
    )
  );
  console.log(
    chalk.bgBlack.greenBright(
      "|     |        \\|  | \\/  \\  \\___   /        \\|  |  |_\\   /  / __ \\_  |"
    )
  );
  console.log(
    chalk.bgBlack.greenBright(
      "|    /_______  /|__|  |__|\\___  > /_______  /|__|____/\\_/  (____  /  |"
    )
  );
  console.log(
    chalk.bgBlack.greenBright(
      "|            \\/               \\/          \\/                    \\/   |"
    )
  );
  console.log(
    chalk.bgBlack.greenBright(
      "======================================================================"
    )
  );
});
