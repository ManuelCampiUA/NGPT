const themeIcon = document.getElementById("toggle_dark");

function setDarkMode() {
    document.body.classList.add("dark_theme");
    localStorage.setItem("theme", "dark");
    themeIcon.src = "static/img/sun.svg";
}

function setLightMode() {
    document.body.classList.remove("dark_theme");
    localStorage.setItem("theme", "light");
    themeIcon.src = "static/img/moon.svg";
}

if (localStorage.getItem("theme") === "light")
    setLightMode();
if (localStorage.getItem("theme") === "dark")
    setDarkMode();

document.addEventListener("DOMContentLoaded", () => {
    themeIcon.addEventListener("click", () => {
        const currentTheme = localStorage.key("theme") ? localStorage.getItem("theme") : "light";
        if (currentTheme === "light") {
            setDarkMode();
            return;
        }
        setLightMode();
    });
});
