document.addEventListener("DOMContentLoaded", function () {
  let url =
    "https://script.google.com/macros/s/AKfycbyeyJ8gBGR6bPSNHMMb9HqRbiw6daPPt-eVV-uYn-aOL6bjhRGL0YBPhFdCz2mWLWkr/exec";

  // POST Data ke Google Sheets
  document
    .getElementById("serviceForm")
    ?.addEventListener("submit", function (e) {
      e.preventDefault();
      let formData = new FormData(this);

      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((data) => {
          console.log({ status: data });
          alert("Data berhasil dikirim!");
          this.reset();
        })
        .catch((error) => console.error("Error:", error));
    });

  // GET Data untuk Admin
  function getData() {
    fetch(url)
      .then((response) => response.json())
      .then((data) => updateTable(data))
      .catch((error) => console.error("Error:", error));
  }

  function updateTable(data) {
    let tableBody = document.getElementById("dataTable");
    if (!tableBody) return `<p>hello<p/>`;

    tableBody.innerHTML = "";

    data.forEach((row) => {
      // Tentukan kelas warna berdasarkan status
      let statusClass = "";
      if (row.status.toLowerCase() === "pending") {
        statusClass = "status-pending";
      } else if (row.status.toLowerCase() === "proses") {
        statusClass = "status-proses";
      } else if (row.status.toLowerCase() === "selesai") {
        statusClass = "status-selesai";
      }

      let tanggal = new Date(row.tanggal).toLocaleDateString("id-ID");
      let tr = document.createElement("tr");
      tr.innerHTML = `
              <td>${row.nama}</td>
              <td>${row.alamat}</td>
              <td>${row.no_hp}</td>
              <td>${row.merk}</td>
              <td>${row.tipe}</td>
              <td>${tanggal}</td>
              <td>${row.jenis_service}</td>
              <td class="flex-center">
                <div class="${statusClass} status"></div>
                <p>${row.status}</p>
              </td>
            `;
      tableBody.appendChild(tr);
    });
  }

  getData();

  // Dynamic Tipe Berdasarkan Merek
  document.getElementById("merk")?.addEventListener("change", function () {
    let tipeSelect = document.getElementById("tipe");
    tipeSelect.innerHTML = `<option value="">Pilih Tipe</option>`;

    let tipeOptions = {
      United: ["E-Metro", "E-Troz", "E-Series"],
      Selis: ["Neo Scootic", "Evo", "Garuda"],
    };

    let selectedMerk = this.value;
    if (tipeOptions[selectedMerk]) {
      tipeOptions[selectedMerk].forEach((tipe) => {
        let option = document.createElement("option");
        option.value = tipe;
        option.textContent = tipe;
        tipeSelect.appendChild(option);
      });
    }
  });
});

// Fitur Pencarian
function searchTable() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let table = document.getElementById("dataTable");
  let rows = table.getElementsByTagName("tr");

  // Looping untuk filter baris
  for (let i = 0; i < rows.length; i++) {
    let rowText = rows[i].innerText.toLowerCase();
    if (rowText.includes(input)) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
}
