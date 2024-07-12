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
        const balance = Number(item.__EMPTY_7) - Number(item.__EMPTY_8);
        document.getElementById("extraBalance").innerHTML =
          startCounter(balance).toLocaleString() + " 원";
      }
    });
  } catch (error) {
    console.error("Error fetching Excel data:", error);
  }
};

const selectMonth = () => {
  var monthSelect = document.getElementById("selectMonth");
  var selectValue = monthSelect.options[monthSelect.selectedIndex].value;
  extractBalances(globalTable, selectValue);
  return selectValue;
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

const saveExcel = (event) => {
  event.preventDefault();
  console.log("Form submitted");
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/list-files");
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
