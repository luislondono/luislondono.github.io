window.onload = function () {
    randomizeTheme()
}

function randomizeTheme() {
    const r = Math.round(Math.random() * 255)
    const g = Math.round(Math.random() * 255)
    const b = Math.round(Math.random() * 255)
    const lite = .2
    const regular = 1
    rgbaString = "rgba(" + r + "," + g + "," + b + "," + regular + ")"
    rgbaLiteString = "rgba(" + r + "," + g + "," + b + "," + lite + ")"
    console.log("Randomizing footerColor: ", rgbaString)
    document.documentElement.style.setProperty('--themeColor', rgbaString);
    document.documentElement.style.setProperty('--footerColor', rgbaLiteString);
}