// Inisialisasi variabel global
let audio;
let isInitialized = false;
let isAnimating = false;
let userName = '';
let clickedHearts = 0;
const totalHearts = 4;

// Inisialisasi SweetAlert
const sweetAlert = Swal.mixin({
    timer: 2300,
    allowOutsideClick: false,
    showConfirmButton: false,
    timerProgressBar: true,
    imageHeight: 90
});

const sweetAlertInput = Swal.mixin({
    allowOutsideClick: false,
    cancelButtonColor: "#FF0040",
    imageHeight: 80
});

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi elemen
    initializeElements();
    
    // Setup event listeners
    setupEventListeners();
    
    // Mulai animasi salju
    startSnowAnimation();
});

function initializeElements() {
    // Get audio element
    audio = document.getElementById('background-music');
    
    // Show main content with fade in
    setTimeout(() => {
        document.getElementById('main-content').style.opacity = '1';
    }, 500);
}

function setupEventListeners() {
    // Gift box click
    document.getElementById('gift-box').addEventListener('click', openGift);
    
    // Love buttons click
    const loveButtons = document.querySelectorAll('.love-btn');
    loveButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleLoveClick(this);
        });
    });
    
    // Continue button click
    document.getElementById('continue-btn').addEventListener('click', showFinalQuestion);
    
    // Continue text click
    document.getElementById('continue-text').addEventListener('click', showFinalQuestion);
}

function startSnowAnimation() {
    // Create snowflakes periodically
    setInterval(createSnowflake, 300);
    
    // Clean up old snowflakes
    setInterval(() => {
        const snowflakes = document.querySelectorAll('.fa-snowflake');
        if (snowflakes.length > 100) {
            snowflakes[0].remove();
        }
    }, 100);
}

function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'fas fa-snowflake';
    snowflake.style.left = Math.random() * 90 + 'vw';
    snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
    document.body.appendChild(snowflake);
}

async function openGift() {
    if (isInitialized || isAnimating) return;
    
    isAnimating = true;
    
    // Animate gift box
    const giftBox = document.getElementById('gift-box');
    giftBox.style.transition = 'all 0.8s ease';
    giftBox.style.transform = 'scale(10)';
    giftBox.style.opacity = '0';
    
    // Animate background
    document.getElementById('wallpaper').style.transform = 'scale(1.5)';
    
    // Hide instruction
    document.getElementById('instruction').style.display = 'none';
    
    // Play music
    audio.play().catch(e => console.log("Autoplay prevented:", e));
    
    // Show greeting after delay
    setTimeout(() => {
        askForName();
    }, 800);
}

async function askForName() {
    try {
        const result = await sweetAlertInput.fire({
            title: "Masukkan Nama Kamu",
            input: "text",
            inputPlaceholder: "Masukkan nama di sini...",
            showCancelButton: true,
            confirmButtonText: "Lanjut",
            cancelButtonText: "Batal",
            inputValidator: (value) => {
                if (!value) {
                    return "Nama tidak boleh kosong!";
                }
                if (value.length > 10) {
                    return "Nama maksimal 10 karakter!";
                }
                return null;
            }
        });
        
        if (result.isConfirmed && result.value) {
            userName = result.value.trim();
            showGreeting();
        } else {
            // Reset if cancelled
            resetAnimation();
        }
    } catch (error) {
        console.error("Error asking for name:", error);
        resetAnimation();
    }
}

function showGreeting() {
    const greetingText = `Hai, ${userName} ✨`;
    const greetingElement = document.getElementById('greeting');
    
    new TypeIt(greetingElement, {
        strings: greetingText,
        speed: 50,
        waitUntilVisible: true,
        afterComplete: function() {
            setTimeout(showMessages, 1000);
        }
    }).go();
}

function showMessages() {
    const messages = [
        'opening-line',
        'instruction-love'
    ];
    
    messages.forEach((id, index) => {
        setTimeout(() => {
            const element = document.getElementById(id);
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            
            if (id === 'instruction-love') {
                // Show love buttons
                document.getElementById('love-buttons').style.display = 'flex';
            }
        }, index * 800);
    });
    
    isInitialized = true;
    isAnimating = false;
}

function handleLoveClick(button) {
    if (button.classList.contains('active')) return;
    
    clickedHearts++;
    button.classList.add('active');
    button.textContent = '❤️';
    
    // Add animation
    button.style.animation = 'pulse 0.5s';
    setTimeout(() => {
        button.style.animation = '';
    }, 500);
    
    if (clickedHearts === totalHearts) {
        // All hearts clicked, show birthday messages
        setTimeout(showBirthdayMessages, 500);
    }
}

function showBirthdayMessages() {
    const messageIds = [
        'message-1', 'message-2', 'message-3',
        'message-4', 'message-5', 'message-6',
        'message-7', 'message-8', 'message-9'
    ];
    
    // Hide love instruction
    document.getElementById('instruction-love').style.opacity = '0';
    
    // Show messages sequentially
    messageIds.forEach((id, index) => {
        setTimeout(() => {
            const element = document.getElementById(id);
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            
            // Show continue text after last message
            if (index === messageIds.length - 1) {
                setTimeout(() => {
                    document.getElementById('continue-text').style.opacity = '1';
                }, 500);
            }
        }, index * 1000);
    });
}

async function showFinalQuestion() {
    if (!userName) return;
    
    try {
        const result = await sweetAlertInput.fire({
            title: "Mau Kado Gak Nih? 😶❤️",
            text: "Ayo jawab 😆",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Mau",
            denyButtonText: "Engga",
            confirmButtonColor: "#ff4081",
            denyButtonColor: "#757575"
        });
        
        if (result.isConfirmed) {
            // User wants gift
            await sweetAlert.fire({
                icon: 'success',
                title: 'Yay! 🎉',
                text: 'Kadonya adalah website spesial ini!'
            });
            
            // Show extra message
            const extraMessage = document.getElementById('extra-message');
            extraMessage.classList.remove('hidden');
            extraMessage.style.opacity = '1';
            extraMessage.style.transform = 'translateY(0)';
            
        } else if (result.isDenied) {
            // User doesn't want gift
            const rejectedDiv = document.getElementById('rejected-message');
            rejectedDiv.classList.remove('hidden');
            
            setTimeout(() => {
                rejectedDiv.style.opacity = '1';
                rejectedDiv.style.transform = 'translateY(0)';
            }, 100);
        }
    } catch (error) {
        console.error("Error in final question:", error);
    }
}

function resetAnimation() {
    // Reset all states
    isInitialized = false;
    isAnimating = false;
    
    // Reset gift box
    const giftBox = document.getElementById('gift-box');
    giftBox.style.transition = '';
    giftBox.style.transform = '';
    giftBox.style.opacity = '';
    
    // Reset background
    document.getElementById('wallpaper').style.transform = '';
    
    // Show instruction
    document.getElementById('instruction').style.display = 'block';
    
    // Reset hearts
    clickedHearts = 0;
    document.querySelectorAll('.love-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.textContent = '🤍';
    });
    
    // Hide messages
    document.querySelectorAll('#message-1, #message-2, #message-3, #message-4, #message-5, #message-6, #message-7, #message-8, #message-9').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
    });
    
    // Hide continue text
    document.getElementById('continue-text').style.opacity = '0';
    
    // Hide love buttons
    document.getElementById('love-buttons').style.display = 'none';
    
    // Hide extra messages
    document.getElementById('extra-message').classList.add('hidden');
    document.getElementById('rejected-message').classList.add('hidden');
    
    // Pause music
    audio.pause();
    audio.currentTime = 0;
}

// Add CSS animation for pulse
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
