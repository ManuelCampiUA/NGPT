const settingsForm = document.getElementById('settings');
const settingsAPIKey = settingsForm.elements['APIKey'];

document.addEventListener('DOMContentLoaded', () => {
    settingsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        settingsAPIKey.value = settingsAPIKey.value.trim();
        settingsForm.submit();
    });
});
