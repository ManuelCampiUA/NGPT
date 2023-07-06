const themeIcon = document.getElementById('toggle_dark');

document.addEventListener('DOMContentLoaded', () => {
    themeIcon.onclick = () => {
        document.body.classList.toggle('dark_theme');
        if (document.body.classList.contains('dark_theme')) {
            themeIcon.src = 'static/img/moon.png';
        } else {
            themeIcon.src = 'static/img/sun.png';
        }
    }
});
