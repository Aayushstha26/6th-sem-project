import app from "./app.js";
import dotenv from "dotenv";
import con from "./database/db.js";
dotenv.config({
  path: "./.env",
});

con()
  .then(() => {
    app.listen(process.env.Port || 4000, () => {
      console.log(
        `Server is running at port http://localhost:${process.env.Port}`
      );
    });
  })
  .catch((e) => {
    console.log("Mongodb connection failed ", e);
  });