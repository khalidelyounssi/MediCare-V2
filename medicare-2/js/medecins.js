document.addEventListener('DOMContentLoaded', () => {

    // --- LOCAL STORAGE KEYS ---
    const DOCTORS_STORAGE_KEY = 'medicareDoctors';
    const SPECIALTIES_STORAGE_KEY = 'specialite';

    // const selectOption = document.getElementById("selectOption");
    // const specialty = JSON.parse(localStorage.getItem("specialite")) || [];
    // console.log(specialty)

    // const afficheSelect = () => {  
    //     specialty.forEach((value) => {
    //         selectOption.innerHTML += `<option value='${value.nom}'>${value.nom}</option>`;
    //     });
    // };

    // afficheSelect();

    // --- Default Data (Used only if localStorage is empty) ---
    const DEFAULT_DOCTORS = [
        { id: 1, name: "Dr. Sofia Rahman", specialty: "Cardiologie", contact: "sofia@medicare.com", status: "Actif", rdv: 120, img: "../assets/doc-1.png" },
        { id: 2, name: "Dr. Ahmed El Hadri", specialty: "Pédiatrie", contact: "ahmed@medicare.com", status: "Actif", rdv: 95, img: "../assets/doc-2.png" },
        { id: 3, name: "Dr. Isabelle Martin", specialty: "Dermatologie", contact: "isabelle@medicare.com", status: "En congé", rdv: 60, img: "../assets/doc-3.png" },
        { id: 4, name: "Dr. Marc Dubois", specialty: "Neurologie", contact: "marc@medicare.com", status: "Actif", rdv: 110, img: "../assets/doc-4.png" }
    ];

    const DEFAULT_SPECIALTIES = [];


    // --- Core Data Management Functions ---

    const loadData = (key, defaultData) => {
        const data = localStorage.getItem(key);
        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                console.error(`Error parsing data from localStorage for key: ${key}`, e);
                return defaultData;
            }
        }
        // Save defaults to localStorage if it's the first time running
        saveData(key, defaultData);
        return defaultData;
    };

    const saveData = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    // Load initial data
    let doctors = loadData(DOCTORS_STORAGE_KEY, DEFAULT_DOCTORS);
    const specialties = loadData(SPECIALTIES_STORAGE_KEY, DEFAULT_SPECIALTIES);

    
    const tableBody = document.querySelector('.min-w-full tbody');
    const addButton = document.querySelector('button.bg-blue-600.text-white'); 
    let isAddingOrEditing = false; 

    // --- Helper Functions (createSpecialtyDropdown, renderDoctorRow, renderEditableRow - unchanged) ---

    const createSpecialtyDropdown = (currentSpecialty = "") => {
        let optionsHtml = specialties.map(spec => 
            `<option value="${spec.nom}" ${spec === currentSpecialty ? 'selected' : ''}>${spec.nom}</option>`
        ).join('');
        
        if (!currentSpecialty) {
             optionsHtml = `<option value="" disabled selected>Choisir une spécialité</option>` + optionsHtml;
        }

        return `
            <select name="specialty" class="specialty w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2">
                ${optionsHtml}
            </select>
        `;
    };

    const renderDoctorRow = (doctor) => {
        const statusClass = doctor.status === "Actif" ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800';
        return `
            <tr class="border-b border-gray-200 hover:bg-gray-50" data-doctor-id="${doctor.id}">
                <td class="py-3 px-6 flex items-center">
                    <img src="${doctor.img}" alt="${doctor.name}" class="w-8 h-8 rounded-full mr-3 object-cover">
                    ${doctor.name}
                </td>
                 <td class="py-3 px-6">${doctor.specialty}</td>
                <td class="py-3 px-6">${doctor.contact}</td>
                <td class="py-3 px-6">
                    <span class="${statusClass} py-1 px-3 rounded-full text-xs">${doctor.status}</span>
                </td>
                <td class="py-3 px-6">${doctor.rdv}</td>
                <td class="py-3 px-6 text-center">
                    <div class="flex item-center justify-center space-x-2">
                        <button class="w-7 h-7 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center text-blue-600 edit-btn" 
                                title="Modifier" data-id="${doctor.id}">
                            <i class="fas fa-edit pointer-events-none"></i>
                        </button>
                        <button class="w-7 h-7 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-600 delete-btn" 
                                title="Supprimer" data-id="${doctor.id}">
                            <i class="fas fa-trash-alt pointer-events-none"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    };

    const renderEditableRow = (doctor) => {
        const isNew = !doctor.id;
        const specialtyDropdown = createSpecialtyDropdown(doctor.specialty);
        const rowId = doctor.id || 'new-doctor'; 

        return `
            <tr class="border-b border-blue-400 bg-blue-50" data-doctor-id="${rowId}" data-mode="edit">
                <td class="py-2 px-6">
                    <input type="text" name="name" value="${doctor.name || ''}" placeholder="Nom du médecin" required
                           class="w-full border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                </td>
                <td 
                class="py-2 px-6">
                
                    ${specialtyDropdown}
                </td>
                <td class="py-2 px-6">
                    <input type="email" name="contact" value="${doctor.contact || ''}" placeholder="Contact (email)" 
                           class="w-full border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                </td>
                <td class="py-2 px-6">
                    <span class="py-1 px-3 rounded-full text-xs bg-yellow-200 text-yellow-800">${doctor.status || (isNew ? 'Nouveau' : 'Actif')}</span>
                </td>
                <td class="py-2 px-6">
                    ${doctor.rdv || 0}
                </td>
                <td class="py-3 px-6 text-center">
                    <div class="flex item-center justify-center space-x-2">
                        <button class="w-7 h-7 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center text-green-600 save-btn" 
                                title="Sauvegarder" data-id="${rowId}">
                            <i class="fas fa-check pointer-events-none"></i>
                        </button>
                        <button class="w-7 h-7 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-600 cancel-btn" 
                                title="Annuler" data-id="${rowId}" data-is-new="${isNew}">
                            <i class="fas fa-times pointer-events-none"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    };

    // --- Core Logic (Rendering and Listeners - unchanged) ---

    const renderDoctors = () => {
        tableBody.innerHTML = '';
        
        doctors.forEach(doctor => {
            tableBody.insertAdjacentHTML('beforeend', renderDoctorRow(doctor));
        });

        attachListeners();
    };

    const attachListeners = () => {
        const cleanAndAttach = (selector, handler) => {
            document.querySelectorAll(selector).forEach(btn => btn.removeEventListener('click', handler));
            document.querySelectorAll(selector).forEach(btn => btn.addEventListener('click', handler));
        };

        cleanAndAttach('.delete-btn', handleDeleteClick);
        cleanAndAttach('.edit-btn', handleEditClick);
        cleanAndAttach('.save-btn', handleSaveClick);
        cleanAndAttach('.cancel-btn', handleCancelClick);
        
        addButton?.removeEventListener('click', addDoctor); 
        addButton?.addEventListener('click', addDoctor); 
    };

    // --- Event Handlers (Updated to include saveData) ---

    const addDoctor = () => {
        if (isAddingOrEditing) {
            alert("Veuillez terminer l'opération en cours (ajout ou modification) avant d'en commencer une autre.");
            return;
        }

        if (tableBody.querySelector('[data-doctor-id="new-doctor"]')) {
             alert("Veuillez terminer l'ajout du médecin actuel.");
             return;
        }
   
        
        const emptyDoctor = { id: null, name: '', specialty: '', contact: '',jours:[], status: 'Actif', rdv: 0, img: "../assets/doc-1.png" };
          

        
        tableBody.insertAdjacentHTML('afterbegin', renderEditableRow(emptyDoctor));
        isAddingOrEditing = true;
        tableBody.querySelector('input[name="name"]')?.focus();
        attachListeners();
    };
    
    const handleEditClick = (event) => {
        if (isAddingOrEditing) {
            alert("Veuillez terminer l'opération en cours.");
            return;
        }
        
        const id = parseInt(event.currentTarget.dataset.id);
        const doctor = doctors.find(doc => doc.id === id);
        if (!doctor) return;

        const rowElement = tableBody.querySelector(`[data-doctor-id="${id}"]`);
        
        rowElement.outerHTML = renderEditableRow(doctor);
        isAddingOrEditing = true;
        attachListeners();
    };

    const handleSaveClick = (event) => {
        const rowId = event.currentTarget.dataset.id;
        const rowElement = tableBody.querySelector(`[data-doctor-id="${rowId}"]`);
        const isNew = rowId === 'new-doctor';

        // 1. Collect and validate data
        const nameInput = rowElement.querySelector('input[name="name"]');
        const specialtySelect = rowElement.querySelector('.specialty');
        const contactInput = rowElement.querySelector('input[name="contact"]');

        const newName = nameInput.value.trim();
        const newSpecialty = specialtySelect.value;
        const newContact = contactInput.value.trim();

        console.log(newSpecialty)
        
        if (!newName || !newSpecialty) {
            alert("Le nom et la spécialité sont obligatoires.");
            return;
        }

        const defaultContact = newName.toLowerCase().replace(/[^a-z0-9]/g, '') + '@medicare.com';

        // 2. Update/Add Doctor object
        if (isNew) {
            const newDoctor = {
                id: Date.now(), 
                name: newName,
                specialty: newSpecialty,
                jours : [],
                contact: newContact || defaultContact, 
                status: 'Actif',
                rdv: 0,
                img: "../assets/doc-1.png" 
            };
            doctors.unshift(newDoctor);
        } else {
            const id = parseInt(rowId);
            const index = doctors.findIndex(doc => doc.id === id);
            if (index !== -1) {
                doctors[index] = {
                    ...doctors[index],
                    name: newName,
                    specialty: newSpecialty,
                    contact: newContact || doctors[index].contact
                };
            }
        }
        
        isAddingOrEditing = false;
        
        // 🌟 SAVE TO LOCALSTORAGE 🌟
        saveData(DOCTORS_STORAGE_KEY, doctors); 
        
        renderDoctors(); 
        alert(`Médecin ${isNew ? 'ajouté' : 'mis à jour'} avec succès.`);
    };
    
    const handleCancelClick = (event) => {
        const rowId = event.currentTarget.dataset.id;
        const isNew = event.currentTarget.dataset.isNew === 'true'; 
        const rowElement = tableBody.querySelector(`[data-doctor-id="${rowId}"]`);
        
        if (isNew) {
            rowElement.remove();
        } else {
            const doctor = doctors.find(doc => doc.id === parseInt(rowId));
            if (doctor) {
                 rowElement.outerHTML = renderDoctorRow(doctor);
            }
        }
        
        isAddingOrEditing = false;
        attachListeners(); 
    };

    const handleDeleteClick = (event) => {
        const id = parseInt(event.currentTarget.dataset.id);
        if (confirm(`Êtes-vous sûr de vouloir supprimer ce médecin ? (ID: ${id})`)) {
            doctors = doctors.filter(doctor => doctor.id !== id);
            
            // 🌟 SAVE TO LOCALSTORAGE 🌟
            saveData(DOCTORS_STORAGE_KEY, doctors);
            
            renderDoctors();
        }
    };

    // --- Initial Call ---
    renderDoctors();
});
