const themeIcon = document.getElementById('toggle_dark');

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('dragstart', (event) => {
        event.preventDefault();
    });
    themeIcon.addEventListener('click', () => {
        document.body.classList.toggle('dark_theme');
        if (document.body.classList.contains('dark_theme')) {
            themeIcon.src = 'static/img/sun.svg';
        } else {
            themeIcon.src = 'static/img/moon.svg';
        }
    });
});
