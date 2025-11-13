const DOCTOR_NAMES = JSON.parse(localStorage.getItem("medicareDoctors"));
// console.log(DOCTOR_NAMES)

const APPOINTMENTS_KEY = "healthAppointments";
const form = document.getElementById("appointment-form");
const doctorSelect = document.getElementById("rdv-doctor");
const dateSelect = document.getElementById("rdv-date");
const appointmentsList = document.getElementById("appointments-list");
const validationMessage = document.getElementById("validation-message");

function getAppointments() {
  return JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || "[]");
}

function saveAppointments(appointments) {
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
}

function renderAppointments() {
  const appointments = getAppointments().sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  appointmentsList.innerHTML = "";

  if (appointments.length === 0) {
    appointmentsList.innerHTML =
      '<p class="text-gray-500 dark:text-gray-400" id="no-appointments">Aucun rendez-vous planifié.</p>';
    return;
  }

  appointments.forEach((app) => {
    const date = new Date(app.date).toLocaleString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newStatus = app.status || "Pending";

    const appElement = document.createElement("div");
    appElement.className =
      "appointment-card bg-white dark:bg-gray-700 p-5 rounded-xl shadow-lg flex justify-between items-center transition-shadow duration-300 hover:shadow-xl border-l-4 border-secondary dark:border-primary";
    appElement.innerHTML = `
            <div>
                <p class="text-lg font-bold text-gray-900 dark:text-white">${date}</p>
                <p class="text-gray-600 dark:text-gray-300">Avec: <span class="font-semibold">${app.doctor}</span></p>
                <p class="text-sm text-gray-500 dark:text-gray-400">${app.name} (${app.email})</p>
                <p class="text-sm  dark:text-gray-400">${newStatus
                 === 'confirmed' ?
                                `<span
                                
                                    class="text-sm text-green-700 font-medium">Confirmed</span> ` :
                (newStatus === 'Pending' ?                
                
                                `<span class="text-sm text-gray-700 font-medium">Pending</span>`:
                                `
                                <span
                                    class="text-sm text-red-700 font-medium">Canceled</span> `)
                 }</p>
            </div>
            <div class="space-x-2">
                <button onclick="editAppointment('${app.id}')" class="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">✏️</button>
                <button onclick="deleteAppointment('${app.id}')" class="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">🗑️</button>
            </div>
        `;
    appointmentsList.appendChild(appElement);
  });
}

window.deleteAppointment = (idToDelete) => {
  let appointments = getAppointments();
  appointments = appointments.filter((app) => app.id !== idToDelete);
  saveAppointments(appointments);
  renderAppointments();
};

window.editAppointment = (idToEdit) => {
  alert(
    "Fonctionnalité de modification : Vous pouvez maintenant rouvrir le formulaire avec les données de l'ID " +
      idToEdit
  );
};

// function populateDoctorSelect() {
//     DOCTOR_NAMES.forEach(name => {
//         const option = document.createElement('option');
//         option.value = name;
//         option.textContent = name.name;
//         // name.jours.forEach(jr =>{

//         //     option.textContent = 3;
//         // })
//         doctorSelect.appendChild(option);

//     });
// }
// function populateDateSelect() {
//     DOCTOR_NAMES.forEach(jours => {
//         const option = document.createElement('option');
//         option.value = jours;
//         option.textContent =jours.jours;
//         // name.jours.forEach(jr =>{

//         //     option.textContent = 3;
//         // })
//         dateSelect.appendChild(option);
//         console.log(jours)
//     });
// }

function populateDoctorSelect() {
  doctorSelect.innerHTML = "";
  DOCTOR_NAMES.forEach((doc) => {
    const option = document.createElement("option");
    option.value = doc.name;
    option.textContent = doc.name;
    doctorSelect.appendChild(option);
  });
}

function populateDateSelect() {
  dateSelect.innerHTML = "";
  const selectedDoctorName = doctorSelect.value;
  const selectedDoctor = DOCTOR_NAMES.find(
    (doc) => doc.name === selectedDoctorName
  );

  if (selectedDoctor) {
    selectedDoctor.jours.forEach((jour) => {
      const option = document.createElement("option");
      option.value = jour;
      option.textContent = jour;
      dateSelect.appendChild(option);
    });
  }
}
doctorSelect.addEventListener("change", populateDateSelect);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    validationMessage.textContent =
      "Veuillez remplir tous les champs correctement.";
    validationMessage.classList.remove("hidden");
    return;
  }

  validationMessage.classList.add("hidden");

  const newAppointment = {
    id: Date.now().toString(),
    name: document.getElementById("rdv-name").value,
    email: document.getElementById("rdv-email").value,
    date: document.getElementById("rdv-date").value,
    doctor: document.getElementById("rdv-doctor").value,
  };

  const appointments = getAppointments();
  appointments.push(newAppointment);
  saveAppointments(appointments);

  form.reset();
  renderAppointments();
  alert("Rendez-vous confirmé avec succès !");
});

document.addEventListener("DOMContentLoaded", () => {
  populateDoctorSelect();
  renderAppointments();
  populateDateSelect();
});
