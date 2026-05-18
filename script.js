/**
 * Point culture (en Français car je suis un peu obligé):
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces.
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 *
 * Sur ce... Amusez-vous bien !
 */
let startTime = null;
let currentWordIndex = 0;
const wordsToType = [];

let totalTypedChars = 0;
let correctTypedChars = 0;
let isTestActive = true;

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry", "melon", "peach", "plum", "mango", "lemon"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery", "desktop", "scanner", "speaker", "network", "storage"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception", "acknowledge", "infrastructure", "phenomenon", "circumstance", "revolutionary"],
};

const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

const startTest = () => {
    wordsToType.length = 0;
    wordDisplay.innerHTML = "";
    currentWordIndex = 0;
    startTime = null;
    totalTypedChars = 0;
    correctTypedChars = 0;
    isTestActive = true;

    inputField.disabled = false;
    inputField.value = "";
    results.textContent = "Results : Waiting for you to type...";

    for (let i = 0; i < 5; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = "red";
        wordDisplay.appendChild(span);
    });

    inputField.focus();
};

// Le timer démarre seulement quand un vrai caractère est tapé (pas sur Espace/Entrée)
const startTimer = (event) => {
    if (!startTime && event.key.length === 1) {
        startTime = Date.now();
    }
};

const checkWord = (event) => {
    if (!isTestActive) return;

    // Espace valide n'importe quel mot ; Espace ET Entrée valident le dernier mot
    const isSpace = event.key === " ";
    const isEnter = event.key === "Enter";
    const isLastWord = currentWordIndex === wordsToType.length - 1;

    if (isSpace || (isEnter && isLastWord)) {
        event.preventDefault();

        // Si le timer n'a pas démarré (l'utilisateur a tapé directement Espace), on ignore
        if (!startTime) return;

        const typedWord = inputField.value.trim();
        const targetWord = wordsToType[currentWordIndex];

        // Comptage : longueur tapée + 1 pour le séparateur (espace ou entrée)
        totalTypedChars += typedWord.length + 1;

        // Comparaison caractère par caractère
        for (let i = 0; i < typedWord.length; i++) {
            if (i < targetWord.length && typedWord[i] === targetWord[i]) {
                correctTypedChars++;
            }
        }
        // Le séparateur est correct seulement si le mot est bon
        if (typedWord === targetWord) {
            correctTypedChars++;
        }

        currentWordIndex++;

        if (currentWordIndex < wordsToType.length) {
            highlightNextWord();
            inputField.value = "";
        } else {
            endTest();
        }
    }
};

const endTest = () => {
    isTestActive = false;
    inputField.disabled = true;

    if (!startTime) {
        results.textContent = "Erreur : le timer n'a pas démarré.";
        return;
    }

    const endTime = Date.now();
    const totalTimeInMinutes = (endTime - startTime) / 1000 / 60;

    const wpm = correctTypedChars / 5 / totalTimeInMinutes;

    const accuracy = totalTypedChars > 0
        ? (correctTypedChars / totalTypedChars) * 100
        : 0;

    const wordElements = wordDisplay.children;
    if (wordElements.length > 0) {
        wordElements[wordElements.length - 1].style.color = "black";
    }

    results.innerHTML = `<strong>Test Terminé !</strong><br>
                         WPM: ${wpm.toFixed(2)}<br>
                         Accuracy: ${accuracy.toFixed(2)}%`;
};

const highlightNextWord = () => {
    const wordElements = wordDisplay.children;
    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "black";
        }
        wordElements[currentWordIndex].style.color = "red";
    }
};

inputField.addEventListener("keydown", (event) => {
    startTimer(event);
    checkWord(event);
});

modeSelect.addEventListener("change", () => startTest());

startTest();