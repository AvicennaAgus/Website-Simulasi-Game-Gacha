// --- DATABASE KARAKTER (Character Mapping) ---
// Simpan gambar AI Anda di folder yang sama dengan file HTML/JS ini.
const CHARACTER_DB = {
    "SSR (5 Bintang)": [
        { id: "ssr_1", name: "Fruktose Rossalinde", img: "ssr_fruktose.jpg" },
        { id: "ssr_2", name: "Orion Starforge", img: "ssr_orion.jpg" },
        { id: "ssr_3", name: "Seraphina Lumina", img: "ssr_seraphina.jpg" },
        { id: "ssr_4", name: "Seraphina Lumina", img: "ssr_dawnspire.jpg" }
    ],
    "SR (4 Bintang)": [
        { id: "sr_1", name: "Draven Thunderfist", img: "sr_draven.jpg" },
        { id: "sr_2", name: "Kira Voltstrike", img: "sr_kira.png" },
        { id: "sr_3", name: "Elara Frostveil", img: "sr_elara.jpg" },
        { id: "sr_4", name: "Mira Tideweaver", img: "sr_mira.jpg" },
        { id: "sr_5", name: "Tessa Starglow", img: "sr_tessa.jpg" }
    ],
    "R (3 Bintang)": [
        { id: "r_1", name: "Zane Shadowblade", img: "r_zane.jpg" },
        { id: "r_2", name: "Lirael Emberheart", img: "r_lirael.jpg" },
        { id: "r_3", name: "Kai Tempest", img: "r_kai.jpg" },
        { id: "r_4", name: "Finn Cloudrunner", img: "r_finn.jpg" },
        { id: "r_5", name: "Sylvi Leafsong", img: "r_sylvi.jpg" },
        { id: "r_6", name: "Talia Sunweaver", img: "r_talia.jpg" }
    ]
};

const RANKS = {
    SSR: 'SSR (5 Bintang)',
    SR: 'SR (4 Bintang)',
    R: 'R (3 Bintang)'
};

let totalRolls = 0;
let counts = { [RANKS.SSR]: 0, [RANKS.SR]: 0, [RANKS.R]: 0 };
let collection = {}; 

// --- LOGIKA GACHA ---

function performSingleRoll(probabilities) {
    const roll = Math.random() * 100;
    let cumulativeProbability = 0;
    let selectedRank = RANKS.R;

    if (roll < probabilities.SSR) {
        selectedRank = RANKS.SSR;
    } else if (roll < probabilities.SSR + probabilities.SR) {
        selectedRank = RANKS.SR;
    }

    // Mengambil karakter acak dari database berdasarkan rank yang didapat
    const characterList = CHARACTER_DB[selectedRank];
    const characterData = characterList[Math.floor(Math.random() * characterList.length)];
    
    return { 
        rank: selectedRank, 
        name: characterData.name, 
        img: characterData.img,
        id: characterData.id 
    };
}

// --- FUNGSI VISUALISASI ---

function createCardElement(cardData) {
    const cardEl = document.createElement('div');
    const rankClass = cardData.rank === RANKS.SSR ? 'card-ssr' : 
                      cardData.rank === RANKS.SR ? 'card-sr' : 'card-r';
    cardEl.className = `card ${rankClass}`;
    
    // Logika gambar: Jika file tidak ada, akan memicu 'onerror' untuk menampilkan placeholder
    const imagePath = `images/${cardData.img}`; // Asumsi gambar ada di dalam folder 'images'

    cardEl.innerHTML = `
        <div class="card-img" style="background-image: url('${imagePath}'); background-size: cover; background-position: center;">
            <span class="img-placeholder" style="display:none;">IMG: ${cardData.name}</span>
        </div>
        <strong>${cardData.name}</strong><br>
        <span style="font-size: 0.8em; color: ${rankClass === 'card-ssr' ? '#d4af37' : rankClass === 'card-sr' ? 'purple' : 'gray'};">
            ${cardData.rank}
        </span>
    `;

    // Cek jika gambar gagal dimuat (file tidak ada)
    const imgDiv = cardEl.querySelector('.card-img');
    const testImg = new Image();
    testImg.src = imagePath;
    testImg.onerror = () => {
        imgDiv.style.backgroundColor = "#444";
        imgDiv.querySelector('.img-placeholder').style.display = "block";
    };

    return cardEl;
}

// --- FUNGSI SISTEM (Sama seperti sebelumnya namun dioptimalkan) ---

function runRolls(num) {
    const probSSR = parseFloat(document.getElementById('probSSR').value);
    const probSR = parseFloat(document.getElementById('probSR').value);
    const probR = parseFloat(document.getElementById('probR').value);
    
    if (Math.abs(probSSR + probSR + probR - 100) > 0.1) {
        alert("Total probabilitas harus 100%");
        return;
    }

    const probabilities = { SSR: probSSR, SR: probSR, R: probR };
    const rollResults = [];
    
    for (let i = 0; i < num; i++) {
        const result = performSingleRoll(probabilities);
        rollResults.push(result);
        
        totalRolls++;
        counts[result.rank]++;
        updateCollection(result);
    }
    
    renderLatest(rollResults);
    updateStatsDisplay();
    renderCollection();
}

function updateCollection(result) {
    if (collection[result.id]) {
        collection[result.id].count++;
    } else {
        collection[result.id] = { ...result, count: 1 };
    }
}

function renderLatest(results) {
    const container = document.getElementById('latestRollsContainer');
    container.innerHTML = '';
    results.forEach(res => container.appendChild(createCardElement(res)));
}

function renderCollection() {
    const container = document.getElementById('cardCollectionContainer');
    container.innerHTML = '';
    
    Object.values(collection).forEach(item => {
        const card = createCardElement(item);
        card.style.position = "relative";
        if (item.count > 1) {
            const badge = document.createElement('div');
            badge.style = "position:absolute; top:-5px; right:-5px; background:red; color:white; border-radius:50%; width:20px; height:20px; font-size:12px; display:flex; align-items:center; justify-content:center; border: 1px solid white;";
            badge.textContent = item.count;
            card.appendChild(badge);
        }
        container.appendChild(card);
    });
}

function updateStatsDisplay() {
    document.getElementById('totalRollsDisplay').textContent = totalRolls;
    document.getElementById('countSSR').textContent = counts[RANKS.SSR];
    document.getElementById('countSR').textContent = counts[RANKS.SR];
}

function runSingleRoll() { runRolls(1); }
function runMultiRoll(n) { runRolls(n); }

function resetSimulation() {
    if (confirm("Reset semua data?")) {
        totalRolls = 0;
        counts = { [RANKS.SSR]: 0, [RANKS.SR]: 0, [RANKS.R]: 0 };
        collection = {};
        renderLatest([]);
        renderCollection();
        updateStatsDisplay();
    }
}

window.onload = () => {
    document.getElementById('latestRollsContainer').innerHTML = "Siap untuk Gacha!";
};