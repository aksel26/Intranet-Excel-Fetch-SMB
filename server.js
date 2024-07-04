const express = require("express");
const path = require("path");
const excelRoutes = require("./routes/excelRoutes");

const app = express();
const port = 3000;

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, "public")));

// 라우트 설정
app.use("/", excelRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
