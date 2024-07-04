const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.sendFile(__dirname + "/../public/login.html");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // 간단한 인증 예제 (실제 애플리케이션에서는 데이터베이스를 사용)
  if (username === "admin" && password === "password") {
    req.session.user = username;
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/");
    }
    res.clearCookie("sid");
    res.redirect("/login");
  });
});

module.exports = router;
