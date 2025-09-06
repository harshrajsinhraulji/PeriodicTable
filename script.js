/* =========================== */
/* 🌟 1. Dark Mode Toggle */
/* =========================== */
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    playSound('Assets/Sounds/buttonclick.mp3');
    updateDarkModeTooltip();
    updateElementDetailColors(); // Update colors when dark mode is toggled
});

// Update tooltip content based on the current mode
function updateDarkModeTooltip() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const isDarkMode = document.body.classList.contains('dark-mode');
    darkModeToggle.setAttribute('data-mode', `Current: ${isDarkMode ? 'dark' : 'light'} mode`);
}

// Initial tooltip update
updateDarkModeTooltip();

/* =========================== */
/* 🌟 2. Search Functionality (Fixed Display Issue) */
/* =========================== */
document.getElementById('search').addEventListener('input', function() {
    let query = this.value.toLowerCase().trim();
    let elements = document.querySelectorAll('.element');
    
    elements.forEach(el => {
        let name = el.getAttribute('data-name');
        if (name) {
            let lowerName = name.toLowerCase();
            let symbol = (el.getAttribute('data-symbol') || "").toLowerCase();
            let number = el.getAttribute('data-number') || "";
            if (query === "" || lowerName.includes(query) || symbol.includes(query) || number === query) {
                // Matching: remove dimmed, add highlight
                el.classList.remove('dimmed');
                el.classList.add('highlight');
            } else {
                // Not matching: remove highlight and add dimmed
                el.classList.remove('highlight');
                el.classList.add('dimmed');
            }
        } else {
            // For placeholders, always dim if a search query exists.
            if (query !== "") {
                el.classList.add('dimmed');
                el.classList.remove('highlight');
            } else {
                el.classList.remove('dimmed');
                el.classList.remove('highlight');
            }
        }
    });
    
    // Also dim the group headings if a search is active.
    let lanthanideHeading = document.querySelector('.extra-elements h3:nth-of-type(1)');
    let actinideHeading = document.querySelector('.extra-elements h3:nth-of-type(2)');
    
    if(query !== "") {
        lanthanideHeading.classList.add('dimmed');
        actinideHeading.classList.add('dimmed');
    } else {
        lanthanideHeading.classList.remove('dimmed');
        actinideHeading.classList.remove('dimmed');
    }
});

/* Play sound when clicking the search bar */
document.getElementById('search').addEventListener('click', function() {
    playSound('Assets/Sounds/searchclick.wav');
});

document.getElementById('search').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        let highlighted = document.querySelector('.element.highlight');
        if (highlighted) {
            highlighted.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }
});

/* =========================== */
/* 🌟 3. Sound Effects Setup */
/* =========================== */
const soundFiles = [
    { name: "Click", src: "Assets/Sounds/click.mp3" },
    { name: "Sheriff", src: "Assets/Sounds/sheriff.mp3" },
    { name: "Blob", src: "Assets/Sounds/blob.wav" },
    { name: "Wind", src: "Assets/Sounds/wind.mp3" },
    { name: "Pop", src: "Assets/Sounds/pop.mp3" }
];

let currentSoundIndex = 0;
let hoverSoundSrc = soundFiles[currentSoundIndex].src;

/* =========================== */
/* 🌟 4. Fix Hover Sound Not Playing Immediately */
/* =========================== */
let soundInitialized = false;

function initializeSound() {
    if (!soundInitialized) {
        let silentAudio = new Audio(hoverSoundSrc);
        silentAudio.volume = 0;
        silentAudio.play().catch(() => {});
        soundInitialized = true;
    }
}

document.addEventListener('click', initializeSound);
document.addEventListener('keydown', initializeSound);

/* =========================== */
/* 🌟 5. Play Sound on Hover */
/* =========================== */
document.querySelectorAll('.element').forEach(element => {
    element.addEventListener('mouseover', () => {
        playSound(hoverSoundSrc);
    });
});

/* =========================== */
/* 🌟 6. Change Sound on Button Click */
/* =========================== */
document.getElementById('change-sound').addEventListener('click', function() {
    currentSoundIndex = (currentSoundIndex + 1) % soundFiles.length;
    hoverSoundSrc = soundFiles[currentSoundIndex].src;
    playSound(hoverSoundSrc); // Play the new sound
    this.setAttribute('data-sound-name', `Current Sound: ${soundFiles[currentSoundIndex].name}`);
});

/* =========================== */
/* 🌟 7. Show Current Sound Name on Hover (Tooltip) */
/* =========================== */
document.getElementById('change-sound').addEventListener('mouseover', function() {
    this.setAttribute('data-sound-name', `Current Sound: ${soundFiles[currentSoundIndex].name}`);
});

/* =========================== */
/* 🌟 8. Fix Element Click Sound Not Playing Before Redirect */
/* =========================== */
let currentDetailedElement = null;
let originalElementColor = '';

document.querySelectorAll('.element').forEach(element => {
    element.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent immediate redirection
        playSound('Assets/Sounds/elementclick.mp3');

        if (element.classList.contains('lanthanide-placeholder') || element.classList.contains('actinide-placeholder')) {
            return; // Do nothing for placeholders
        }

        if (currentDetailedElement === this) {
            closeElementDetail();
        } else {
            showElementDetail(this);
        }
    });
});

function showElementDetail(element) {
    if (currentDetailedElement) {
        currentDetailedElement.classList.add('dimmed');
        currentDetailedElement.classList.remove('highlight');
    }

    currentDetailedElement = element;

    // Dim all elements
    document.querySelectorAll('.element').forEach(el => {
        el.classList.add('dimmed');
    });

    // Highlight the clicked element without changing its color
    element.classList.remove('dimmed');
    element.classList.add('highlight');

    // Scroll to the detailed view
    document.getElementById('element-detail').classList.remove('hidden');
    document.getElementById('element-detail').scrollIntoView({ behavior: 'smooth' });

    // Update the detailed view with element data
    originalElementColor = window.getComputedStyle(element).backgroundColor;
    document.querySelector('.element-box').style.backgroundColor = originalElementColor;
    document.querySelector('.element-symbol').textContent = element.getAttribute('data-symbol');
    document.querySelector('.element-name').textContent = element.getAttribute('data-name');
    document.querySelector('.element-weight').textContent = element.getAttribute('data-weight');
    document.querySelector('.element-number').textContent = element.getAttribute('data-number');
    document.querySelector('.element-info-name').textContent = element.getAttribute('data-name');
    document.querySelector('.element-phase').textContent = `Phase: ${element.getAttribute('data-phase')}`;
    document.querySelector('.element-halflife').textContent = `Half-life: ${element.getAttribute('data-halflife')}`;
    document.querySelector('.element-meltingpoint').textContent = `Melting Point: ${element.getAttribute('data-meltingpoint')}`;
    document.querySelector('.element-boilingpoint').textContent = `Boiling Point: ${element.getAttribute('data-boilingpoint')}`;
    document.querySelector('.element-electronicConfiguration').textContent = `Electronic Configuration: ${element.getAttribute('data-electronicConfiguration')}`;

    updateElementDetailColors(); // Update colors when showing element detail
}

function closeElementDetail() {
    document.getElementById('element-detail').classList.add('hidden');
    document.querySelectorAll('.element').forEach(el => {
        el.classList.remove('dimmed');
        el.classList.remove('highlight');
    });
    document.querySelector('.periodic-table-container').scrollIntoView({ behavior: 'smooth' });
    currentDetailedElement = null;
}

// Close button functionality
document.getElementById('close-detail').addEventListener('click', closeElementDetail);

// Function to update element detail colors based on the current mode
function updateElementDetailColors() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const elementBox = document.querySelector('.element-box');
    const closeButton = document.getElementById('close-detail');

    if (isDarkMode) {
        elementBox.style.backgroundColor = '#333';
        elementBox.style.color = 'white';
        closeButton.style.backgroundColor = '#555';
        closeButton.style.color = 'white';
    } else {
        elementBox.style.backgroundColor = originalElementColor;
        elementBox.style.color = 'black';
        closeButton.style.backgroundColor = '#3097e6';
        closeButton.style.color = 'white';
    }
}

/* =========================== */
/* 🌟 9. Tooltip Click Event (Lanthanide & Actinide) */
/* =========================== */
document.querySelectorAll('.tooltip').forEach(tooltip => {
    tooltip.addEventListener('click', () => {
        playSound('Assets/Sounds/tooltipclick.mp3');
    });
});

/* =========================== */
/* 🌟 10. Helper Function to Play Sound (Prevents Delay) */
/* =========================== */
function playSound(src) {
    let audio = new Audio(src);
    audio.play();
}

/* =========================== */
/* 🌟 11. Scroll and Highlight Lanthanides and Actinides */
/* =========================== */
document.querySelector('.element.lanthanide-placeholder').addEventListener('click', function() {
    const lanthanidesContainer = document.querySelector('.lanthanides-container');
    lanthanidesContainer.scrollIntoView({ behavior: 'smooth' });
    highlightElements(lanthanidesContainer.querySelectorAll('.element.lanthanide'));
});

document.querySelector('.element.actinide-placeholder').addEventListener('click', function() {
    const actinidesContainer = document.querySelector('.actinides-container');
    actinidesContainer.scrollIntoView({ behavior: 'smooth' });
    highlightElements(actinidesContainer.querySelectorAll('.element.actinide'));
});

function highlightElements(elements) {
    const isDarkMode = document.body.classList.contains('dark-mode');
    elements.forEach(el => {
        el.classList.add('highlight');
        el.style.boxShadow = isDarkMode ? '0 0 15px white' : '0 0 3px blue';
    });
    setTimeout(() => {
        elements.forEach(el => {
            el.classList.remove('highlight');
            el.style.boxShadow = '';
        });
    }, 600); // Highlight for 0.6 second
}

// Add event listeners to the h2 element for hover sound and click event
const titleElement = document.querySelector('h2');
let titleSound = new Audio('Assets/Sounds/title.mp3');

titleElement.addEventListener('mouseover', function() {
    titleSound.play();
});

titleElement.addEventListener('mouseout', function() {
    titleSound.pause();
    titleSound.currentTime = 0; // Reset the sound to the beginning
});

titleElement.addEventListener('click', function() {
    window.open('https://www.linkedin.com/in/harshrajsinhraulji', '_blank');
});