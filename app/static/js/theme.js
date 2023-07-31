const themeIcon = document.getElementById("toggle_dark");

function setDarkMode() {
    document.body.classList.remove("light_theme");
    document.body.classList.add("dark_theme");
    localStorage.setItem("theme", "dark");
    themeIcon.src = "static/img/sun.svg";
}

function setLightMode() {
    document.body.classList.remove("dark_theme");
    document.body.classList.add("light_theme");
    localStorage.setItem("theme", "light");
    themeIcon.src = "static/img/moon.svg";
}

if (localStorage.getItem("theme") === "dark")
    setDarkMode();

document.addEventListener("DOMContentLoaded", () => {
    themeIcon.addEventListener("click", () => {
        const currentTheme = document.body.classList[0];
        if (currentTheme === "light_theme") {
            setDarkMode();
            return;
        }
        setLightMode();
    });
});
