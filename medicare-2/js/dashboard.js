 document.getElementById("deconnecter").addEventListener("click", fun)
 document.getElementById("signOut").addEventListener("click", fun)
 function fun() {

   if (confirm("Voulez-vous vous déconnecter ?")) {
    window.location.href = "../index.html";
   } 

};


