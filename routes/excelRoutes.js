const express = require("express");
const SMB2 = require("smb2");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// 세션 확인 미들웨어
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}
// SMB 클라이언트 설정 함수
function createSmbClient() {
  return new SMB2({
    share: "\\\\192.168.0.2\\ACG",
    domain: "acg",
    username: "Administrator",
    password: "!acg%6185",
  });
}

// 엑셀 파일 읽기 함수
async function readExcelFromSMB(filePath) {
  return new Promise((resolve, reject) => {
    const smbClient = createSmbClient();
    smbClient.readFile(filePath, (err, data) => {
      if (err) return reject(err);

      // 임시 파일에 저장
      const tempFilePath = path.join(__dirname, "../temp.xlsx");
      fs.writeFileSync(tempFilePath, data);

      // 엑셀 파일 읽기
      const workbook = XLSX.readFile(tempFilePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // 임시 파일 삭제
      fs.unlinkSync(tempFilePath);

      resolve(jsonData);
    });
  });
}

// 이름 포함 여부 확인 함수
function findIndexOfString(array, searchString) {
  return array.find((element) => element.includes(searchString));
}

// 폴더 내 파일 리스트 조회 함수
async function listFilesFromSMB(directory) {
  return new Promise((resolve, reject) => {
    const smbClient = createSmbClient();
    smbClient.readdir(directory, (err, files) => {
      console.log("🚀 ~ smbClient.readdir ~ err:", err);
      if (err) return reject(err);
      resolve(files);
    });
  });
}

router.get("/list-files", requireLogin, async (req, res) => {
  try {
    const directory = decodeURIComponent("test"); // SMB 서버의 폴더 경로
    const files = await listFilesFromSMB(directory);

    if (files.length > 0) {
      const index = findIndexOfString(files, "김현민");

      const filePath = decodeURIComponent(`[ACG] 식대정리\\${index}`); // SMB 서버의 파일 경로

      const data = await readExcelFromSMB(filePath);

      // res.json({tableData:data, user:req.session.user});
      const resData = { tableData: data, user: "윤용설" };
      res.json(resData);
    }
  } catch (error) {
    console.error("Error listing files:", error);
    res.status(500).json({ error: "Failed to list files" });
  }
});

router.post("/updateExcel", (req, res) => {
  const { payerName, place, amount } = req.body;
  console.log(
    "🚀 ~ router.post ~ payerName, place, amount:",
    payerName,
    place,
    amount
  );
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/");
    }
    res.clearCookie("sid");
    res.redirect("/");
  });
});

module.exports = router;
