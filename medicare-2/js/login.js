const login = document.getElementById("login");

login.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();


  const validUser = "secretaire";
  const validPassword = "admin123";

  if (username === validUser && password === validPassword) {
    localStorage.setItem("username", username);

    window.location.href = "dashboard pages/dashboard.html";
  } else {
    alert("Nom d'utilisateur ou mot de passe incorrect !");
  }
});
