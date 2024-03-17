const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config(); //要 config 在使用之前才找的到
const authRoute = require("./routes").auth; //找到 router 資料夾中的 auth
const courseRouter = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

//connect to mongo DB

mongoose
  .connect("mongodb://localhost:27017/mernDB")
  .then(() => {
    console.log("connecting to Mongodb");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(express.urlencoded({ extend: true }));
app.use(cors());

app.use("/api/user", authRoute);

// 只有登入系統的人，才能夠去新增課程或是註冊課程
// jwt
// course router 應該被jwt保護
// 如果 request header 內部沒有 jwt，則 request 就會被視為 unauthorized

app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRouter
);

app.listen(8080, () => {
  console.log("server in port 8080");
});
