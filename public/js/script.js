let globalTable = [];
var counter = 0;

function startCounter(balance) {
  const counterElement = document.getElementById("extraBalance");

  setTimeout(function () {
    counterElement.innerHTML = balance;
  }, 200);
}

const extractBalances = async (data, month) => {
  try {
    data.forEach((item) => {
      if (item.__EMPTY_1 === Number(month)) {
        console.log(item);
        const balance = Number(item.__EMPTY_7) - Number(item.__EMPTY_9);
        document.getElementById("extraBalance").innerHTML =
          startCounter(balance) + " 원";
      }
    });
  } catch (error) {
    console.error("Error fetching Excel data:", error);
  }
};

const selectMonth = () => {
  let monthSelect = document.getElementById("selectMonth");
  let selectValue = monthSelect.options[monthSelect.selectedIndex].value;
  extractBalances(globalTable, selectValue);
  return selectValue;
};

let attendance = "근무";
const selectAttendance = () => {
  let monthSelect = document.getElementById("attendance");
  let selectValue = monthSelect.options[monthSelect.selectedIndex].value;
  attendance = selectValue;
};

const initMonth = () => {
  const month = new Date().getMonth() + 1;
  document.getElementById("selectMonth").value = month.toString();
  return month;
};

const userNameFetch = (name) => {
  console.log("🚀 ~ userNameFetch ~ name:", name);
  document.getElementById("userName").innerHTML = name;
  if (name) {
  } else {
    document.getElementById("userName").innerHTML = "이름 없음";
  }
};

const formatCurrency = (amount) => {
  return parseInt(amount, 10).toLocaleString("ko-KR");
};

const submitExcelForm = document.querySelector("#submitExcel");
const saveExcel = async (event) => {
  event.preventDefault();

  const payerName = submitExcelForm.elements.payerName.value;
  const place = submitExcelForm.elements.place.value;
  const amount = submitExcelForm.elements.amount.value;

  const response = await fetch("/updateExcel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      payerName: payerName,
      place: place,
      amount: amount,
      attendance: attendance,
    }),
  });
  console.log("🚀 ~ saveExcel ~ response:", response);
};

const userName = sessionStorage.getItem("userName");
const params = new URLSearchParams({
  userName: userName,
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const encodedUserName = encodeURIComponent(userName); // URL 인코딩
    const url = `/list-files?name=${encodedUserName}`;

    const response = await fetch(url);
    // console.log("🚀 ~ document.addEventListener ~ response:", response);
    const { tableData, user } = await response.json();
    console.log(
      "🚀 ~ document.addEventListener ~ tableData, user:",
      tableData,
      user
    );
    if (tableData.length > 0) {
      globalTable = tableData.slice(3, 9);
      if (tableData || user) {
        const nowMonth = initMonth();
        extractBalances(tableData, nowMonth);
        userNameFetch(user);
      }
    }

    // 파일 리스트를 콘솔에 출력
  } catch (error) {
    console.error("Error fetching file list:", error);
  }
});

function logout() {
  fetch("/logout")
    .then(() => (window.location.href = "/"))
    .catch((err) => console.error("Error logging out:", err));
}
