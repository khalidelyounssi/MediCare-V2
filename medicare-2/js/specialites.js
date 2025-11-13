let formil = document.getElementById('formil');
let btnAjouti = document.getElementById('btnAjo');
let btnAnnuler = document.getElementById('btnAnnuler');
let btnEnre = document.getElementById('btnEnre');
let nomSpecialite = document.getElementById('nomSpecialite');
let descSpecialite = document.getElementById('descSpecialite');

let specialite = [];
let editIndex = -1;

btnAjouti.addEventListener('click', () => {
    formil.className = "bg-white rounded-lg shadow-md p-6 mb-6";
    editIndex = -1;
    nomSpecialite.value = '';
    descSpecialite.value = '';
});

btnAnnuler.addEventListener('click', () => {
    formil.className = "bg-white rounded-lg shadow-md p-6 mb-6 hidden";
});

btnEnre.addEventListener('click', () => {
    if (editIndex === -1) {
        let newSpecialite = {
            nom: nomSpecialite.value,
            desc: descSpecialite.value,
        };
        specialite.push(newSpecialite);
    } else {
        specialite[editIndex].nom = nomSpecialite.value;
        specialite[editIndex].desc = descSpecialite.value;
        editIndex = -1;
    }
    localStorage.setItem('specialite', JSON.stringify(specialite));
    renderList();
    formil.className = "bg-white rounded-lg shadow-md p-6 mb-6 hidden";
});

function renderList() {
    let specialiteContainer = document.getElementById('listeSpecialites');
    specialiteContainer.innerHTML = '';
    specialite.forEach((spe, i) => {    
        let specialiteRow = document.createElement('tr');
        specialiteRow.classList = 'hover:bg-gray-50';
        specialiteRow.innerHTML =  `
                        <td class="px-6 py-4">
                            <div class="font-semibold text-gray-900">${spe.nom} </div>
                        </td>
                        <td class="px-6 py-4 text-gray-600">
                           ${spe.desc}
                        </td>
                        

                        <td class="px-6 py-4 text-center gap ">
                            <button onclick="modifierSp(${i})" 
                                    class="  bg-green-400 -500 hover:bg-green-300 text-white px-4 py-2 rounded-lg mr-2">
                                Modifier
                            </button>
                            <button onclick="supprimSp(${i})"
                                    class="  bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                                 Supprimer
                            </button>
                        </td>
                    `;
        specialiteContainer.appendChild(specialiteRow);
    });
}

if (localStorage.getItem('specialite')) {
    specialite = JSON.parse(localStorage.getItem('specialite'));
}
renderList();

function supprimSp(i) {
    let specialiteASupprimer = specialite[i];
    let doctar = JSON.parse(localStorage.getItem('medicareDoctors')) || [];
    
    let specialiteUtilisee = doctar.some(docteur => 
        docteur.specialty === specialiteASupprimer.nom
    );
    
    if (specialiteUtilisee) {
        alert('you can not delete this specialty: it is used by a doctor');
    } else {
        specialite.splice(i, 1);
        localStorage.setItem('specialite', JSON.stringify(specialite));
    }
    
    renderList();
}

function modifierSp(i) {
    editIndex = i;
    formil.className = "bg-white rounded-lg shadow-md p-6 mb-6";
    nomSpecialite.value = specialite[i].nom;
    descSpecialite.value = specialite[i].desc;
}






