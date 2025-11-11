
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

// console.log("rendezVous: ",rendezVous[rendezVous.length-1]);

const totalMedecins = medecins.length;
const totalDisponibles = medecins.filter(disponibilites => disponibilites.jours && disponibilites.jours.length > 0).length;
const totalRendezVous = rendezVous.length;
const totalSpecialites = specialites.length;

document.getElementById("medecins").textContent = totalMedecins;
document.getElementById("disponibilites").textContent = totalDisponibles;
document.getElementById("rendez-vous").textContent = totalRendezVous;
document.getElementById("specialites").textContent = totalSpecialites;

// ==============  Activité Récente =================

