const express = require("express");
const router = express.Router();

// router.get("/login", (req, res) => {
//   res.sendFile(__dirname + "/../public/login.html");
// });

const users = [
  { id: "hmkim", userName: "김현민", password: "hmkim2467" },
  { id: "jhkim", userName: "김정현", password: "jhkim2467" },
  { id: "ysyoon", userName: "윤용설", password: "ysyoon2467" },
  { id: "dakim", userName: "김단아", password: "dakim2467" },
];

router.post("/login", (req, res) => {
  const { userId, password } = req.body;
  console.log("🚀 ~ router.post ~ userId, password:", userId, password);

  // 간단한 인증 예제 (실제 애플리케이션에서는 데이터베이스를 사용)

  // Find user
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(400).json({ message: "사용자가 존재하지 않습니다." });
  }

  console.log("🚀 ~ router.post ~ user:", user);
  // Check password
  const isMatch = password === user.password;
  if (!isMatch) {
    return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
  }
  console.log("✅", isMatch);

  if (userId === user.id && password === user.password) {
    req.session.user = userId;
    console.log("✅");
    res.json({ message: "로그인 성공", user: user.userName });
  } else {
    return res.status(401).send("Invalid username or password");
  }
});

module.exports = router;
