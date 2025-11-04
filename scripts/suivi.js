const MEASURES_KEY = 'healthMeasures';
const form = document.getElementById('health-form');
const measureType = document.getElementById('measure-type');
const valueField1 = document.getElementById('value-field-1');
const valueField2 = document.getElementById('value-field-2');
const measuresList = document.getElementById('measures-list');
const avgPoidsEl = document.getElementById('avg-poids');
const lastTensionEl = document.getElementById('last-tension');
const globalStatusEl = document.getElementById('global-status');
const noMeasuresEl = document.getElementById('no-measures');

function getMeasures() {
    return JSON.parse(localStorage.getItem(MEASURES_KEY) || '[]');
}

function saveMeasures(measures) {
    localStorage.setItem(MEASURES_KEY, JSON.stringify(measures));
}

function updateValueFields() {
    const type = measureType.value;
    const isTension = type === 'tension';
    
    if (isTension) {
        valueField1.querySelector('label').textContent = 'Systolique (Pression haute)';
        valueField2.classList.remove('hidden');
        document.getElementById('measure-value-2').required = true;
    } else {
        valueField1.querySelector('label').textContent = type === 'poids' ? 'Poids (kg)' : 'Glycémie (mg/dL)';
        valueField2.classList.add('hidden');
        document.getElementById('measure-value-2').required = false;
    }
}

function calculateSummary(measures) {
    const poidsMeasures = measures.filter(m => m.type === 'poids').map(m => parseFloat(m.value));
    const tensionMeasures = measures.filter(m => m.type === 'tension').sort((a, b) => new Date(b.date) - new Date(a.date));
    const glycemieMeasures = measures.filter(m => m.type === 'glycemie').map(m => parseFloat(m.value));

    const avgPoids = poidsMeasures.length 
        ? (poidsMeasures.reduce((sum, val) => sum + val, 0) / poidsMeasures.length).toFixed(1) 
        : '--';
    avgPoidsEl.textContent = `${avgPoids} kg`;

    const lastTension = tensionMeasures.length 
        ? `${tensionMeasures[0].value}/${tensionMeasures[0].value2}` 
        : '--/--';
    lastTensionEl.textContent = lastTension;

    let status = 'Optimale';
    let statusClass = 'text-green-600 dark:text-green-400';
    
    const lastGly = glycemieMeasures.length ? glycemieMeasures[glycemieMeasures.length - 1] : 0;
    const lastSys = tensionMeasures.length ? parseFloat(tensionMeasures[0].value) : 0;
    const lastDia = tensionMeasures.length ? parseFloat(tensionMeasures[0].value2) : 0;

    if (lastGly > 140 || lastSys > 140 || lastDia > 90) {
        status = 'Attention';
        statusClass = 'text-red-600 dark:text-red-400';
    } else if (lastGly > 100 || lastSys > 120 || lastDia > 80) {
        status = 'Vigilance';
        statusClass = 'text-yellow-600 dark:text-yellow-400';
    }

    globalStatusEl.textContent = status;
    globalStatusEl.className = `text-3xl font-bold mt-1 ${statusClass}`;
}

function renderMeasures() {
    const measures = getMeasures().sort((a, b) => new Date(b.date) - new Date(a.date));
    measuresList.innerHTML = '';
    
    if (measures.length === 0) {
        noMeasuresEl.classList.remove('hidden');
        calculateSummary(measures);
        return;
    }
    
    noMeasuresEl.classList.add('hidden');

    measures.forEach(m => {
        const date = new Date(m.date).toLocaleDateString('fr-FR');
        let valueText = m.type === 'tension' ? `${m.value}/${m.value2} mmHg` : `${m.value} ${m.type === 'poids' ? 'kg' : 'mg/dL'}`;
        let typeText = m.type.charAt(0).toUpperCase() + m.type.slice(1);

        const li = document.createElement('li');
        li.className = 'bg-white dark:bg-gray-700 p-4 rounded-lg shadow flex justify-between items-center';
        li.innerHTML = `
            <div>
                <span class="font-semibold text-primary dark:text-secondary">${typeText} :</span>
                <span class="text-gray-900 dark:text-white font-medium">${valueText}</span>
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">${date}</span>
        `;
        measuresList.appendChild(li);
    });

    calculateSummary(measures);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const type = measureType.value;
    const value = document.getElementById('measure-value').value;
    const value2 = document.getElementById('measure-value-2').value;
    
    const newMeasure = {
        type: type,
        value: value,
        value2: type === 'tension' ? value2 : null,
        date: new Date().toISOString()
    };
    
    const measures = getMeasures();
    measures.push(newMeasure);
    saveMeasures(measures);
    
    form.reset();
    updateValueFields();
    renderMeasures();
});

measureType.addEventListener('change', updateValueFields);

document.addEventListener('DOMContentLoaded', () => {
    updateValueFields();
    renderMeasures();
});