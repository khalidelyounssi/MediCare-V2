
const logoutDesktop = document.getElementById("deconnecter");
const logoutMobil = document.getElementById("signOut");



logoutDesktop.addEventListener("click", fun)
logoutMobil.addEventListener("click", fun)

function fun() {

  if (confirm("Voulez-vous vous déconnecter ?")) {
    window.location.href = "../index.html";
    localStorage.removeItem('username');
  }

};

// <!-- Total -->

const medecins = JSON.parse(localStorage.getItem("medicareDoctors")) || 0;
const disponibilites = JSON.parse(localStorage.getItem("disponibilites")) || 0;
const rendezVous = JSON.parse(localStorage.getItem("healthAppointments")) || 0;
const specialites = JSON.parse(localStorage.getItem("specialite")) || 0;



const totalMedecins = medecins.length;
const totalDisponibles = medecins.filter(disponibilites => disponibilites.jours && disponibilites.jours.length > 0).length;
const totalRendezVous = rendezVous.length;
const totalSpecialites = specialites.length;

// console.log(totalRendezVous)

document.getElementById("medecins").textContent = totalMedecins;
document.getElementById("disponibilites").textContent = totalDisponibles;
document.getElementById("rendez-vous").textContent = totalRendezVous;
document.getElementById("specialites").textContent = totalSpecialites;

// ==============  Activité Récente =================

// <span>Nouvel ajout de spécialité : Neurologie</span>

const Dr = rendezVous[rendezVous.length - 1].doctor;
const clien = rendezVous[rendezVous.length - 1].name;

const span1 = document.createElement("span");
span1.textContent = `Nouveau rendez-vous pour ${Dr} avec ${clien}`;
document.getElementById("newRondezVous").appendChild(span1);


// ========================================
const nouvelMedecin = medecins[0].name;
const medecinsSP = medecins[0].specialty;


const span3 = document.createElement("span");
span3.textContent = `Nouveau médecin ajouté : ${nouvelMedecin} (${medecinsSP})`;
document.getElementById("newAnnulation").appendChild(span3);


// ==============================================
const specialite = specialites[specialites.length - 1].nom;

const span4 = document.createElement("span");
span4.textContent = `Nouvel ajout de spécialité : ${specialite}`;
document.getElementById("newSpecialite").appendChild(span4);



// ============================================================================================

function updateChart() {
  const rendezVous = JSON.parse(localStorage.getItem("healthAppointments")) || 0;
  let total = rendezVous.length;
  console.log(total)
  let confirmed = 0;
  let pending = 0;
  let canceled = 0;

  
  for (let i = 0; i < rendezVous.length; i++) {
    if (rendezVous[i].status === "confirmed") confirmed++;
    else if (rendezVous[i].status === "canceled") canceled++;
    else pending++;
  }

  
  let confirmedPct = Math.round((confirmed / total) * 100);
  let pendingPct = Math.round((pending / total) * 100);
  let canceledPct = 100 - confirmedPct - pendingPct;

  let circle = document.getElementById("circle");
  circle.style.background = `
    conic-gradient(
      #3b82f6 0% ${confirmedPct}%,
      #f59e0b ${confirmedPct}% ${confirmedPct + pendingPct}%,
      #ef4444 ${confirmedPct + pendingPct}% 100%
    )
  `;
  circle.style.mask = "radial-gradient(transparent 65%, black 70%)";
  circle.style.webkitMask = "radial-gradient(transparent 65%, black 70%)";

  document.getElementById("confirmedPct").textContent = confirmedPct + "%";
  document.getElementById("pendingPct").textContent = pendingPct + "%";
  document.getElementById("canceledPct").textContent = canceledPct + "%";
  document.getElementById("totalPercent").textContent = "100%";
}


function addAppointment(status) {
  rendezVous.push({ status: status });
  updateChart();
}


updateChart();


