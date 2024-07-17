const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const excelRoutes = require("./routes/excelRoutes");
const http = require("http");

const app = express();
app.use(bodyParser.json());

const port = 3000;

// 루트 경로 ('/')
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// 세션 설정
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // HTTPS를 사용하는 경우 true로 설정
  })
);

// 바디 파서 설정
app.use(bodyParser.urlencoded({ extended: true }));

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, "public")));

// 기본 라우트를 로그인 페이지로 설정
app.get("/", (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    // res.redirect("/main");
    res.sendFile(path.join(__dirname, "views", "main.html"));
  }
});

// 메인 페이지
app.get("/main", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "main.html"));
});

console.log(
  "🚀 ~ http.globalAgent.options.keepAliveTimeout:",
  http.globalAgent.options.keepAliveTimeout
);

// 라우트 설정
app.use("/", authRoutes);
app.use("/", excelRoutes);

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
// Keep-Alive Timeout 설정 (밀리초 단위)
server.keepAliveTimeout = 165000; // 65초

// 헤더 타임아웃도 함께 설정 (Node.js v13.0.0 이상)
server.headersTimeout = 166000; // 66초 (Keep-Alive Timeout보다 약간 더 길게)
