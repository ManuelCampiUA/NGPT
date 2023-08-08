const themeIcon = document.getElementById('toggle-dark');
const themeLogo = document.getElementById('NapolitanoGPT-logo');
const themeLogoIndex = document.getElementById('NapolitanoGPT-logo-Index');

function setDarkMode() {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
    themeIcon.src = 'static/img/sun.svg';
    themeLogo.src = 'static/img/logodark.png';
    themeLogoIndex.src='static/img/logodark.png';
}

function setLightMode() {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
    themeIcon.src = 'static/img/moon.svg';
    themeLogo.src = 'static/img/logo.png';
    themeLogoIndex.src='static/img/logo.png';
}

if (localStorage.getItem('theme') === 'dark')
    setDarkMode();

document.addEventListener('DOMContentLoaded', () => {
    themeIcon.addEventListener('click', () => {
        const currentTheme = document.body.classList[0];
        if (currentTheme === 'light-theme') {
            setDarkMode();
            return;
        }
        setLightMode();
    });
});
