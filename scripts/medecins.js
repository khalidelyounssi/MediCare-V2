const DOCTORS = [
    { id: 1, name: "Dr. Lamy Dupont", specialty: "Cardiologie", available: true, image: "../images/doc-1.png" },
    { id: 2, name: "Dr. Alice Dubois", specialty: "Dermatologie", available: false, image: "../images/doc-2.png" },
    { id: 3, name: "Prof. Marc Leroux", specialty: "Généraliste", available: true, image: "../images/doc-3.png" },
    { id: 4, name: "Dr. Sophie Moreau", specialty: "Pédiatrie", available: true, image: "../images/doc-4.png" },
    { id: 5, name: "Dr. Julien Petit", specialty: "Ophtalmologie", available: true, image: "../images/doc-5.png" },
    { id: 6, name: "Dr. Elena Rossi", specialty: "Cardiologie", available: true, image: "../images/doc-6.png" },
    { id: 7, name: "Dr. Ben Ali", specialty: "Pédiatrie", available: false, image: "../images/doc-7.png" },
];

const FAVORITES_KEY = 'doctorFavorites';
const doctorsListContainer = document.getElementById('doctors-list');
const specialtyFilter = document.getElementById('specialty-filter');
const doctorSearch = document.getElementById('doctor-search');
const showFavoritesBtn = document.getElementById('show-favorites-btn');
const availabilityFilter = document.getElementById('availability-filter');
const favoritesTitle = document.getElementById('favorites-title');

function getFavorites() {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
}

function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

window.toggleFavorite = (doctorId) => {
    let favorites = getFavorites();
    const id = parseInt(doctorId);
    
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    
    saveFavorites(favorites);
    filterDoctors(); 
};

function renderDoctorCard(doctor) {
    const isFavorite = getFavorites().includes(doctor.id);
    
    const availabilityClass = doctor.available 
        ? 'bg-green-500 text-white shadow-md' 
        : 'bg-red-500 text-white shadow-md';
    
    const availabilityText = doctor.available ? 'Disponible' : 'Indisponible';

    const favoriteIconClass = isFavorite 
        ? 'text-yellow-400 hover:text-gray-400' 
        : 'text-gray-300 dark:text-gray-500 hover:text-yellow-400';
       
    const imagePath = doctor.image || "../images/placeholder.jpg"; 
    
    return `
        <div class="doctor-card bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center text-center transform hover:scale-[1.02] transition-transform duration-300 border-t-4 border-secondary dark:border-primary">
            <img src="${imagePath}" alt="${doctor.name}" class="w-32 h-32 rounded-full object-cover mb-4 border-4 border-gray-200 dark:border-gray-700 shadow-md">
            <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-1">${doctor.name}</h4>
            <p class="text-secondary dark:text-primary font-medium mb-3">${doctor.specialty}</p>
            
            <div class="flex items-center justify-between w-full mt-2">
                <span class="text-xs font-semibold px-3 py-1 rounded-full ${availabilityClass}">
                    ${availabilityText}
                </span>
                <button class="p-2 favorite-btn transition-colors duration-200" data-id="${doctor.id}" onclick="toggleFavorite(${doctor.id})">
                    <svg class="w-7 h-7 ${favoriteIconClass} fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

function displayDoctors(doctors) {
    if (doctors.length === 0) {
        doctorsListContainer.innerHTML = '<p class="col-span-full text-center text-xl text-gray-500 dark:text-gray-400 py-10">Aucun médecin ne correspond à vos critères.</p>';
    } else {
        doctorsListContainer.innerHTML = doctors.map(renderDoctorCard).join('');
    }
}

window.filterDoctors = () => {
    const searchTerm = doctorSearch.value.toLowerCase();
    const selectedSpecialty = specialtyFilter.value;
    const selectedAvailability = availabilityFilter.value;
    const isShowingFavorites = showFavoritesBtn.classList.contains('bg-secondary');
    
    let filteredDoctors = DOCTORS;

    if (isShowingFavorites) {
        const favorites = getFavorites();
        filteredDoctors = filteredDoctors.filter(d => favorites.includes(d.id));
        favoritesTitle.classList.remove('hidden');
    } else {
        favoritesTitle.classList.add('hidden');
    }
    

    if (selectedSpecialty) {
        filteredDoctors = filteredDoctors.filter(d => d.specialty === selectedSpecialty);
    }
    
    if (selectedAvailability) {
        const isAvailable = selectedAvailability === 'available';
        filteredDoctors = filteredDoctors.filter(d => d.available === isAvailable);
    }

    if (searchTerm) {
        filteredDoctors = filteredDoctors.filter(d => 
            d.name.toLowerCase().includes(searchTerm) || 
            d.specialty.toLowerCase().includes(searchTerm)
        );
    }
    
    displayDoctors(filteredDoctors);
};

function initDoctorsPage() {

    const specialties = [...new Set(DOCTORS.map(d => d.specialty))].sort();
    specialties.forEach(specialty => {
        const option = document.createElement('option');
        option.value = specialty;
        option.textContent = specialty;
        specialtyFilter.appendChild(option);
    });
    
   
    showFavoritesBtn.addEventListener('click', () => {
        const isCurrentlyFavoriteMode = showFavoritesBtn.classList.contains('bg-secondary');
        
        showFavoritesBtn.classList.toggle('bg-secondary', !isCurrentlyFavoriteMode);
        showFavoritesBtn.classList.toggle('bg-primary', isCurrentlyFavoriteMode);
        
        showFavoritesBtn.textContent = isCurrentlyFavoriteMode
            ? '⭐ Voir mes Favoris'
            : '✅ Afficher Tous';
            
        filterDoctors();
    });
    
    filterDoctors();
}

document.addEventListener('DOMContentLoaded', initDoctorsPage);