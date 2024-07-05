const express = require("express");
const router = express.Router();

// router.get("/login", (req, res) => {
//   res.sendFile(__dirname + "/../public/login.html");
// });

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("🚀 ~ router.post ~ username, password:", username, password);
  // 간단한 인증 예제 (실제 애플리케이션에서는 데이터베이스를 사용)
  if (username === "admin" && password === "1234") {
    req.session.user = username;
    res.redirect("/main");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
