const icon = document.getElementById('toggle_dark');

document.addEventListener('DOMContentLoaded', () => {
    icon.onclick = function () {
        document.body.classList.toggle('dark_theme')
        if (document.body.classList.contains('dark_theme')) {
            icon.src = 'static/img/moon.png'
        } else {
            icon.src = 'static/img/sun.png'
        }
    }
});