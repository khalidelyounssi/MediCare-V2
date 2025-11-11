let userform = document.querySelector("#userForm");
let searchBar = document.getElementById("searchar");
let list = document.querySelector("#table-body");
let add = document.getElementById("add");
// let loadedData = JSON.parse(localStorage.getItem("healthAppointments"));

// let mydata = [
//   {
//     id: "1762779814695",
//     name: "karbitou",
//     email: "mehdikarbitou@gmail.com",
//     date: "2003-02-22T02:20",
//     doctor: "Dr. Lamy Dupont (Cardiologie)",
//     status: true,
//   },
// ];
let savedData = JSON.parse(localStorage.getItem("healthAppointments"));
console.log("savedData", savedData);

function allRdvData() {
  list.innerHTML = "";
  savedData.forEach((client) => {
    list.className = "text-gray-700 text-sm font-light";
    let info = document.createElement("tr");
    info.className = "border-b border-gray-200 hover:bg-gray-50";

    let id = document.createElement("td");
    id.className = " py-3 px-6";
    id.textContent = client.id;

    let name = document.createElement("td");
    name.className = " py-3 px-6";
    name.textContent = client.name;

    let doctor = document.createElement("td");
    doctor.className = " py-3 px-6";
    doctor.textContent = client.doctor;

    let email = document.createElement("td");
    email.className = "py-3 px-6";
    email.textContent = client.email;

    let jour = document.createElement("td");
    jour.className = "py-3 px-6";
    jour.textContent = client.date;

    let status = document.createElement("td");
    status.className = "py-3 px-6";

    switch (client.status) {
      case "confirmed":
        status.textContent = "Confirmed";
        status.className = "py-3 px-6 text-green-600 font-medium";
        break;
      case "canceled":
        status.textContent = "Canceled";
        status.className = "py-3 px-6 text-red-600 font-medium";
        break;
      default:
        status.textContent = "Pending";
        status.className = "py-3 px-6 text-gray-600 font-medium";
        if (client.status !== "pending") {
          client.status = "pending";
        }
        break;
    }

    let choose = document.createElement("td");
    choose.className = "py-3 px-6 text-center";

    let buttons = document.createElement("div");
    buttons.className = "flex item-center justify-center space-x-2";

    let acceptButton = document.createElement("button");
    acceptButton.className =
      "w-7 h-7 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center text-green-600";
    acceptButton.title = "accepter";

    let acceptIcon = document.createElement("i");
    acceptIcon.className = "fas fa-check";

    let refuseButton = document.createElement("button");
    refuseButton.className =
      "w-7 h-7 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-600";
    refuseButton.title = "refused";

    let refuseIcon = document.createElement("i");
    refuseIcon.className = "fas fa-times";

    acceptButton.addEventListener("click", () => {
      if (client.status !== "confirmed") {
        client.status = "confirmed";
        status.textContent = "Confirmed";
        status.className = "py-3 px-6 text-green-600 font-medium";
        localStorage.setItem("healthAppointments", JSON.stringify(savedData));
      }
    });

    refuseButton.addEventListener("click", () => {
      if (client.status !== "canceled") {
        client.status = "canceled";
        status.textContent = "Canceled";
        status.className = "py-3 px-6 text-red-600 font-medium";
        localStorage.setItem("healthAppointments", JSON.stringify(savedData));
      }
    });

    info.appendChild(id);
    info.appendChild(name);
    info.appendChild(email);
    info.appendChild(doctor);
    info.appendChild(jour);
    info.appendChild(status);
    info.appendChild(choose);
    choose.appendChild(buttons);
    buttons.appendChild(acceptButton);
    buttons.appendChild(refuseButton);
    acceptButton.appendChild(acceptIcon);
    refuseButton.appendChild(refuseIcon);

    list.appendChild(info);
  });
}

calculate();
allRdvData();

function calculate() {
  let length = savedData.length;
  const statistics = "there is " + length + " " + "rondez-vous";
  add.innerHTML = statistics;
}

function filtere() {
  const searchText = searchar.value.toLowerCase();
  savedData.filter((client) => {
    let find = client.doctor.includes(searchText);
  });
}
