const login = document.getElementById("login");

login.addEventListener("submit", function (e) {
  e.preventDefault(); 

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;


  if (username === "secretaire" && password === "admin123") {
    window.location.href = "dashboard pages/dashboard.html";
  } else {
    alert("Nom d'utilisateur ou mot de passe incorrect");
  }
});