const themeIcon = document.getElementById('toggle-dark');

const setDarkMode = () => {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
};

const setLightMode = () => {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
};

if (localStorage.getItem('theme') === 'dark') setDarkMode();

document.addEventListener('DOMContentLoaded', () =>
    themeIcon.addEventListener('click', () => {
        const currentTheme = document.body.classList[0];
        if (currentTheme === 'light-theme') {
            setDarkMode();
            return;
        }
        setLightMode();
    })
);
