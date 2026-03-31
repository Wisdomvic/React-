// Global variables for contact management
let nameInput, numberInput, saveContactBtn, contactlist;

document.addEventListener("DOMContentLoaded", () => {
    const category = document.querySelector('#category');
    const severity = document.querySelector('#severity');
    const severityOutput = document.querySelector('#severity-value');
    nameInput = document.querySelector('#name');
    numberInput = document.querySelector('#number');
    saveContactBtn = document.querySelector('#save-contact-btn');
    const saveBtn = document.querySelector('#save-btn');
    const text = document.querySelector('#text');
    const historylist = document.querySelector("#history-list");
    const frequent = document.querySelector('#frequent');
    const worst = document.querySelector('#worst');
    const bars = document.querySelector('#bars');
    contactlist = document.querySelector('#contact');

    // Severity
    severity.addEventListener("input", () => {
        severityOutput.value = severity.value;
    });

    saveBtn.addEventListener("click", () => {
        console.log("Button clicked!");

        const symptom = {
            id: Date.now(),
            area: category.value,
            severity: severity.value,
            note: text.value,
            date: new Date().toLocaleDateString()
        };

        console.log("Symptom object:", symptom);

        // Step 1 - Get existing symptoms
        const symptoms = JSON.parse(localStorage.getItem("symptoms")) || [];

        // Step 2 - Add new symptom
        symptoms.push(symptom);

        // Step 3 - Save back to localStorage
        localStorage.setItem("symptoms", JSON.stringify(symptoms));
        displaySymptoms();
        console.log("saved to localStorage:", localStorage.getItem("symptoms"));

        category.value = "head";
        severity.value = 5;
        severityOutput.value = 5;
        text.value = "";
    });

    saveContactBtn.addEventListener("click", () => {
        const contact = {
            id: Date.now(),
            name: nameInput.value,
            number: numberInput.value,
        };
        const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
        contacts.push(contact);
        localStorage.setItem("contacts", JSON.stringify(contacts));
        displayContacts();
        nameInput.value = "";
        numberInput.value = "";
    });

    displaySymptoms();
    displayContacts();
    displayInsights();
});

// Functions moved to global scope so onclick handlers can access them

function displaySymptoms() {
    const historylist = document.querySelector("#history-list");
    // Step 1 - Get symptoms from localStorage
    const symptoms = JSON.parse(localStorage.getItem("symptoms")) || [];

    // Step 2 - Clear the history list first
    historylist.innerHTML = "";

    // Step 3 - Loop through each symptom
    symptoms.forEach((symptom) => {
        const card = document.createElement("div");
        card.className = "history-card";
        card.innerHTML = `
            <div class="history-card-info">
                <div class="date">${symptom.date}</div>
                <div class="area">${symptom.area}</div>
                <div class="note">${symptom.note}</div>
            </div>
            <div class="history-card-severity">
                ${symptom.severity}<small>/10</small>
            </div>
            <button class="btn-danger" onclick="deleteSymptom(${symptom.id})">Delete</button>
        `;
        historylist.appendChild(card);
    });
}

function deleteSymptom(id) {
    const symptoms = JSON.parse(localStorage.getItem("symptoms")) || [];
    const updated = symptoms.filter((s) => s.id !== id);
    localStorage.setItem("symptoms", JSON.stringify(updated));
    displaySymptoms();
}

function displayContacts() {
    contactlist = document.querySelector('#contact');
    const contacts = JSON.parse(localStorage.getItem("contacts")) || [];

    // Clear the contact list first
    contactlist.innerHTML = "";

    // Loop through each contact
    contacts.forEach((contact) => {
        const card = document.createElement("div");
        card.className = "contact";
        card.innerHTML = `
            <div class="contact-card">
                <div class="contact-card-info">
                    <div class="contact-name">👤 ${contact.name}</div>
                    <div class="contact-number">📞 ${contact.number}</div>
                </div>
                <div class="contact-card-actions">
                    <button class="btn-copy" onclick="copyNumber('${contact.number}')">Copy</button>
                    <button class="btn-danger" onclick="deleteContact(${contact.id})">Delete</button>
                </div>
            </div>
        `;

        contactlist.appendChild(card);
    });
}

// function for contact deleting
function deleteContact(id) {
    const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    const updated = contacts.filter((c) => c.id !== id);
    localStorage.setItem("contacts", JSON.stringify(updated));
    displayContacts();
}

// function copy number
function copyNumber(number) {
    navigator.clipboard.writeText(number);
    // Show a message to user that it was copied
    alert("📞 Number copied to clipboard!");
}

// Pattern Insights functionality
function displayInsights() {
    const symptoms = JSON.parse(localStorage.getItem("symptoms")) || [];
    
    const frequentEl = document.querySelector('#frequent');
    const worstEl = document.querySelector('#worst');
    const barsEl = document.querySelector('#bars');

    if (symptoms.length === 0) {
        frequentEl.innerHTML = '<p>No data yet. Start logging symptoms!</p>';
        worstEl.innerHTML = '<p>No data yet</p>';
        barsEl.innerHTML = '';
        return;
    }

    // 1. Most frequent symptom (body area)
    const areaCount = {};
    symptoms.forEach(s => {
        const area = s.area.toLowerCase();
        areaCount[area] = (areaCount[area] || 0) + 1;
    });

    let mostFrequent = '';
    let maxCount = 0;
    for (const [area, count] of Object.entries(areaCount)) {
        if (count > maxCount) {
            maxCount = count;
            mostFrequent = area;
        }
    }
    frequentEl.innerHTML = `<strong>🔁 Most Frequent:</strong> ${capitalize(mostFrequent)} (${maxCount} time${maxCount > 1 ? 's' : ''})`;

    // 2. Worst day (day with highest average severity)
    const daySeverity = {};
    symptoms.forEach(s => {
        const date = s.date;
        if (!daySeverity[date]) {
            daySeverity[date] = { total: 0, count: 0 };
        }
        daySeverity[date].total += parseInt(s.severity);
        daySeverity[date].count += 1;
    });

    let worstDay = '';
    let worstAvg = 0;
    for (const [date, data] of Object.entries(daySeverity)) {
        const avg = data.total / data.count;
        if (avg > worstAvg) {
            worstAvg = avg;
            worstDay = date;
        }
    }
    worstEl.innerHTML = `<strong>📉 Worst Day:</strong> ${worstDay} (avg severity: ${worstAvg.toFixed(1)}/10)`;

    // 3. Severity distribution bars
    const severityRanges = {
        '1-3 (Mild)': 0,
        '4-6 (Moderate)': 0,
        '7-10 (Severe)': 0
    };

    symptoms.forEach(s => {
        const sev = parseInt(s.severity);
        if (sev <= 3) severityRanges['1-3 (Mild)']++;
        else if (sev <= 6) severityRanges['4-6 (Moderate)']++;
        else severityRanges['7-10 (Severe)']++;
    });

    const maxBarCount = Math.max(...Object.values(severityRanges), 1);

    barsEl.innerHTML = `
        <div class="severity-bars">
            ${Object.entries(severityRanges).map(([label, count]) => {
                const width = (count / maxBarCount) * 100;
                return `
                <div class="bar-row">
                    <span class="bar-label">${label}</span>
                    <div class="bar-container">
                        <div class="bar" style="width: ${width}%"></div>
                    </div>
                    <span class="bar-count">${count}</span>
                </div>
                `;
            }).join('')}
        </div>
    `;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
