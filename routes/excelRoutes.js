const express = require("express");
const SMB2 = require("@marsaud/smb2");

const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const ExcelJS = require("exceljs");
const { promisify } = require("util");

const router = express.Router();
const readFileAsync = promisify(fs.readFile);

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
      // fs.unlinkSync(tempFilePath);

      resolve(jsonData);
    });
  });
}

const updateFunction = async (
  worksheet,
  payerName,
  place,
  amount,
  attendance
) => {
  // 여기서 워크시트의 특정 셀 값을 변경합니다.
  // 예: A8 셀의 값을 변경

  const nowDate = new Date().getDate();
  const nowMonth = new Date().getMonth() + 1;
  let todayRow;
  worksheet.eachRow((row, rowNumber) => {
    const monthCell = row.getCell("C").value;
    const dateCell = row.getCell("D").value;

    // 숫자 형식으로 변환 후 비교
    const month = parseInt(monthCell, 10);
    const date = parseInt(dateCell, 10);

    if (month === nowMonth && date === nowDate) {
      todayRow = rowNumber;
      console.log(`Matching row found at row number: ${rowNumber}`);
    }
  });

  //근태
  worksheet.getCell(`H${todayRow}`).value = attendance;
  //상호명
  worksheet.getCell(`I${todayRow}`).value = place;
  // 금액
  worksheet.getCell(`J${todayRow}`).value = amount;
  //비고
  worksheet.getCell(`L${todayRow}`).value = payerName;

  // 필요한 경우 여기서 추가적인 작업을 수행할 수 있습니다.
};

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

function writeFile(path, data) {
  return new Promise((resolve, reject) => {
    console.log("🤔");
    const smbClient = createSmbClient();
    smbClient.writeFile(path, data, { flag: "w" }, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

router.get("/list-files", requireLogin, async (req, res) => {
  const userName = req.query.name; // 자동으로 디코딩
  console.log(`Received userName: ${userName}`);

  try {
    const directory = decodeURIComponent("test"); // SMB 서버의 폴더 경로
    const files = await listFilesFromSMB(directory);

    if (files.length > 0) {
      const index = findIndexOfString(files, userName);

      const filePath = decodeURIComponent(`test\\${index}`); // SMB 서버의 파일 경로

      const data = await readExcelFromSMB(filePath);

      // res.json({tableData:data, user:req.session.user});
      const resData = { tableData: data, user: userName };
      res.json(resData);
    }
  } catch (error) {
    console.error("Error listing files:", error);
    res.status(500).json({ error: "Failed to list files" });
  }
});

router.post("/updateExcel", async (req, res) => {
  const { payerName, place, amount, attendance } = req.body;
  const localPath = "./temp.xlsx";

  // 2. 엑셀 파일 읽기
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(localPath);
  const worksheet = workbook.getWorksheet("내역");

  // 3. 데이터 업데이트
  await updateFunction(worksheet, payerName, place, amount, attendance);

  // 4. 업데이트된 워크북을 파일로 저장
  await workbook.xlsx.writeFile(localPath);

  // 5. 수정된 파일을 SMB 서버에 업로드
  const updatedFileData = await readFileAsync(localPath);

  const directory = decodeURIComponent(`test\\test.xlsx`); // SMB 서버의 폴더 경로
  await writeFile(directory, Buffer.from(updatedFileData));

  return res.status(200).send("OK");
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
