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
const path = require("path");
const port = process.env.PORT || 8080;

//connect to mongo DB

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connecting to Mongodb");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(express.urlencoded({ extend: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "/client")));

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

if (process.env.NODE_ENV === "production") {
  app.get("*", (res, req) => {
    res.sendFile(path.join(path.join(__dirname, "/client/public/index.html")));
  });
}

app.listen(port, () => {
  console.log("server in port 8080");
});
