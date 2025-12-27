const EXCHANGE_RATE = 1.95583;
let currentInput = "";

// Поддръжка на гласово разпознаване (включително за мобилни телефони)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'bg-BG';
    recognition.interimResults = false;

    recognition.onerror = function(event) {
        console.error("Грешка при микрофона:", event.error);
        stopMicAnimation();
        recognition.stop();
    };

    recognition.onend = function() {
        stopMicAnimation();
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        processVoiceCommand(transcript);
    };
}

function appendNumber(number) {
    currentInput += number;
    updateDisplay();
}

function updateDisplay() {
    const bgnField = document.getElementById('bgn-input');
    const eurField = document.getElementById('eur-input');
    if (bgnField && eurField) {
        let val = parseFloat(currentInput) || 0;
        bgnField.value = val.toFixed(2);
        eurField.value = (val / EXCHANGE_RATE).toFixed(2);
    }
}

function clearDisplay() {
    currentInput = "";
    updateDisplay();
}

function startVoice() {
    if (!recognition) {
        alert("Вашият браузър не поддържа гласово въвеждане.");
        return;
    }
    try {
        recognition.start();
        startMicAnimation();
    } catch (e) {
        recognition.stop();
        stopMicAnimation();
    }
}

function processVoiceCommand(cmd) {
    // Вземаме само цифрите от казаното
    const num = cmd.replace(/[^0-9]/g, '');
    if (num) {
        currentInput = num;
        updateDisplay();
    }
}

function startMicAnimation() {
    const micBtn = document.getElementById('mic-btn');
    if (micBtn) micBtn.classList.add('pulse');
}

function stopMicAnimation() {
    const micBtn = document.getElementById('mic-btn');
    if (micBtn) micBtn.classList.remove('pulse');
}
