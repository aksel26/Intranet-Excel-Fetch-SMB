const paintTable = async (params) => {
  try {
    const tableHead = document.getElementById("tableHead");
    const tableBody = document.getElementById("tableBody");
    const response = await fetch(`/read-excel?${params}`);
    const data = await response.json();

    if (data.length > 0) {
      // 테이블 헤더 생성
      const headers = Object.keys(data[0]);
      const headerRow = document.createElement("tr");
      headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
      });
      tableHead.appendChild(headerRow);

      // 테이블 바디 생성
      data.forEach((row) => {
        const rowElement = document.createElement("tr");
        headers.forEach((header) => {
          const td = document.createElement("td");
          td.textContent = row[header];
          rowElement.appendChild(td);
        });
        tableBody.appendChild(rowElement);
      });
    }
  } catch (error) {
    console.error("Error fetching Excel data:", error);
  }
};
function findIndexOfString(array, searchString) {
  console.log("🚀 ~ findIndexOfString ~ array:", array);
  return array.find((element) => element.includes(searchString));
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/list-files");
    const files = await response.json();

    if (files.length > 0) {
      const index = findIndexOfString(files, "윤용설");
      if (index) {
        const params = new URLSearchParams({ search: index });

        paintTable(params);
      }
    }

    // 파일 리스트를 콘솔에 출력
  } catch (error) {
    console.error("Error fetching file list:", error);
  }
});

function logout() {
  fetch("/logout")
    .then(() => (window.location.href = "/login"))
    .catch((err) => console.error("Error logging out:", err));
}
