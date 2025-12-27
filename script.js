// Константи и променливи
const EXCHANGE_RATE = 1.95583;
let currentInput = "";
let isMuted = false;

// Инициализация на гласово разпознаване
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'bg-BG';
    recognition.interimResults = false;

    // Защита от блокиране при грешка
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

// Функции за изчисления
function appendNumber(number) {
    currentInput += number;
    updateDisplay();
    speak(number);
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
    speak("Изчистване");
}

// Функция за говорене със защита (Mute)
function speak(text) {
    if (isMuted || !window.speechSynthesis) return;
    
    // Спираме текущото говорене, за да не се застъпват
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bg-BG';
    window.speechSynthesis.speak(utterance);
}

// Функция за Mute
function toggleMute() {
    isMuted = !isMuted;
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
        muteBtn.innerText = isMuted ? '🔇' : '🔊';
    }
}

// Работа с микрофона
function startVoice() {
    if (!recognition) {
        alert("Браузърът ви не поддържа гласови команди.");
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
    const num = cmd.replace(/[^0-9]/g, '');
    if (num) {
        currentInput = num;
        updateDisplay();
        speak(num + " лева");
    }
}

function startMicAnimation() {
    document.getElementById('mic-btn').classList.add('pulse');
}

function stopMicAnimation() {
    document.getElementById('mic-btn').classList.remove('pulse');
}
