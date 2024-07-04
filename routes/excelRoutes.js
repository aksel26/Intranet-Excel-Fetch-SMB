const express = require("express");
const SMB2 = require("smb2");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// SMB 클라이언트 설정
const smbClient = new SMB2({
  share: "\\\\192.168.0.2\\ACG",
  domain: "acg",
  username: "Administrator",
  password: "!acg%6185",
});

// 엑셀 파일 읽기 함수
async function readExcelFromSMB(filePath) {
  return new Promise((resolve, reject) => {
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

// 폴더 내 파일 리스트 조회 함수
async function listFilesFromSMB(directory) {
  return new Promise((resolve, reject) => {
    smbClient.readdir(directory, (err, files) => {
      if (err) return reject(err);
      resolve(files);
    });
  });
}

router.get("/read-excel", async (req, res) => {
  try {
    console.log("🚀 ~ router.get ~ req.query:", req.query);
    const { search } = req.query;
    const dd = search.toString();
    console.log("🚀 ~ router.get ~ dd:", dd);

    const filePath = decodeURIComponent(`[ACG] 식대정리\\${dd}`); // SMB 서버의 파일 경로

    const data = await readExcelFromSMB(filePath);
    res.json(data);
  } catch (error) {
    console.error("Error reading Excel file:", error);
    res.status(500).json({ error: "Failed to read Excel file" });
  }
});

router.get("/list-files", async (req, res) => {
  try {
    const directory = decodeURIComponent("[ACG] 식대정리"); // SMB 서버의 폴더 경로
    const files = await listFilesFromSMB(directory);
    res.json(files);
  } catch (error) {
    console.error("Error listing files:", error);
    res.status(500).json({ error: "Failed to list files" });
  }
});

module.exports = router;
