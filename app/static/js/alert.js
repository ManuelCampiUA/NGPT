const closeAlert = document.querySelector('.close-btn');
const alertElement = document.querySelector('.alert');
const alertText = document.querySelector('.alert-text');

function successAlert(message) {
    alertText.innerHTML = message;
    alertElement.classList.add('alert-success');
    alertElement.style.display = 'flex';
}
function warningAlert(message) {
    alertText.innerHTML = message;
    alertElement.classList.add('alert-warning');
    alertElement.style.display = 'flex';
}
function errorAlert(message) {
    alertText.innerHTML = message;
    alertElement.classList.add('alert-error');
    alertElement.style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
    closeAlert.addEventListener('click', () => {
        alertElement.style.display = 'none';
    });
});