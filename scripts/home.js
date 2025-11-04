
const HTML_ELEMENT = document.documentElement;
const THEME_TOGGLE_CHECKBOX = document.getElementById('theme-toggle');
const BURGER_MENU_BTN = document.getElementById('burger-menu-btn');
const MOBILE_MENU = document.getElementById('mobile-menu');

const DARK_MODE_KEY = 'darkMode';


function loadThemeState() {
    const isDarkMode = localStorage.getItem(DARK_MODE_KEY) === 'true';
    if (isDarkMode) {
        HTML_ELEMENT.classList.add('dark');
        THEME_TOGGLE_CHECKBOX.checked = true;
    } else {
        HTML_ELEMENT.classList.remove('dark');
        THEME_TOGGLE_CHECKBOX.checked = false;
    }
}

function handleThemeToggle() {
    const isChecked = THEME_TOGGLE_CHECKBOX.checked;
    
    if (isChecked) {
        HTML_ELEMENT.classList.add('dark');
        localStorage.setItem(DARK_MODE_KEY, 'true');
    } else {
        HTML_ELEMENT.classList.remove('dark');
        localStorage.setItem(DARK_MODE_KEY, 'false');
    }
}

function handleBurgerMenu() {
    MOBILE_MENU.classList.toggle('hidden');
}



const HEALTH_TIPS = [
    "Un sommeil de qualité est essentiel. Visez 7 à 9 heures par nuit. 😴",
    "L'hydratation est clé : buvez de l'eau tout au long de la journée. 💧",
    "30 minutes d'activité physique quotidienne améliorent l'humeur. 🏃‍♀️",
    "Pratiquez la pleine conscience pour gérer le stress chronique. 🧘",
    "Une alimentation riche en légumes est la base d'une bonne santé. 🥦",
];
let currentTipIndex = 0;
const HEALTH_CAROUSEL = document.getElementById('health-carousel');

function updateCarousel() {
    if (!HEALTH_CAROUSEL) return; 
     const tip = HEALTH_TIPS[currentTipIndex];
      HEALTH_CAROUSEL.style.opacity = '0'; 
    
    setTimeout(() => {
        HEALTH_CAROUSEL.innerHTML = `<p class="text-center text-3xl font-semibold text-primary dark:text-secondary">${tip}</p>`;
        HEALTH_CAROUSEL.style.opacity = '1'; 
        currentTipIndex = (currentTipIndex + 1) % HEALTH_TIPS.length;
    }, 500); 
}


const GLOBAL_SEARCH_BAR = document.getElementById('global-search-bar');
const ARTICLE_RESULTS = document.getElementById('article-results');
let articles = []; 

function filterArticles() {
    if (!GLOBAL_SEARCH_BAR) return;

    const searchTerm = GLOBAL_SEARCH_BAR.value.toLowerCase();
    
    if (articles.length === 0) {
        articles = Array.from(document.querySelectorAll('.article-item'));
    }

    articles.forEach(article => {
        const title = article.querySelector('.article-title').textContent.toLowerCase();
        const text = article.querySelector('.article-text').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || text.includes(searchTerm)) {
            article.classList.remove('hidden');
        } else {
            article.classList.add('hidden');
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {

    loadThemeState();
    if (THEME_TOGGLE_CHECKBOX) {
        THEME_TOGGLE_CHECKBOX.addEventListener('change', handleThemeToggle);
    }
    
    if (BURGER_MENU_BTN) {
        BURGER_MENU_BTN.addEventListener('click', handleBurgerMenu);
    }
    
    if (HEALTH_CAROUSEL) {
        updateCarousel(); 
        setInterval(updateCarousel, 5000); 
    }
    if (GLOBAL_SEARCH_BAR) {
        GLOBAL_SEARCH_BAR.addEventListener('input', filterArticles);
    }
});