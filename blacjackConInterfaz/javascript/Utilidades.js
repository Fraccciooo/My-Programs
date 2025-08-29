// Utilidades generales para el juego

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function showMessage(element, msg) {
    element.textContent = msg;
}

export function toggleElementVisibility(element, isVisible) {
    if (isVisible) {
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
    }
}

export function disableButton(button, isDisabled) {
    button.disabled = isDisabled;
}