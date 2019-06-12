window.onload = function () {
    // setInterval(randomizeTheme, 50)
    // randomizeTheme()
}

var increase = { r: true, g: true, b: true }

function randomizeTheme() {
    const currentThemeColorString = getComputedStyle(document.documentElement)
        .getPropertyValue("--themeColor")
    // console.log(currentThemeColorString)
    const currentRGBA = parseRBGAfromString(currentThemeColorString)


    // const r = Math.round(Math.random() * 255)
    // const g = Math.round(Math.random() * 255)
    // const b = Math.round(Math.random() * 255)

    // console.table(currentRGBA)
    console.log("r: ", currentRGBA.r, " g: ", currentRGBA.g, " b: ", currentRGBA.b, increase)

    if (increase.r) {
        r = (slideValue(currentRGBA.r, 255, 10, true, false))
        if (r > 240) {
            increase.r = false
        }
    }
    else {
        r = (slideValue(currentRGBA.r, 255, 10, false, false))
        if (r < 10) {
            increase.r = true
        }
    }
    if (increase.g) {
        g = (slideValue(currentRGBA.g, 255, 10, true, false))
        if (g > 240) {
            increase.g = false
        }
    }
    else {
        g = (slideValue(currentRGBA.r, 255, 10, false, false))
        if (g < 10) {
            increase.g = true
        }
    }
    if (increase.b) {
        b = (slideValue(currentRGBA.b, 255, 10, true, false))
        if (b > 240) {
            increase.b = false
        }
    }
    else {
        b = (slideValue(currentRGBA.b, 255, 10, false, false))
        if (b < 10) {
            increase.b = true
        }
    }




    const lite = .2
    const regular = 1
    rgbaString = "rgba(" + r + "," + g + "," + b + "," + regular + ")"
    rgbaLiteString = "rgba(" + r + "," + g + "," + b + "," + lite + ")"
    // console.log("Randomizing footerColor: ", rgbaString)
    document.documentElement.style.setProperty('--themeColor', rgbaString);
    document.documentElement.style.setProperty('--footerColor', rgbaLiteString);
}

String.prototype.nthIndexOf = function (pattern, n) {
    var i = -1;

    while (n-- && i++ < this.length) {
        i = this.indexOf(pattern, i);
        if (i < 0) break;
    }

    return i;
}

function parseRBGAfromString(rgbString) {
    const R = parseInt(rgbString.substring(rgbString.indexOf("(") + 1, rgbString.indexOf(",")))
    const G = parseInt(rgbString.substring(rgbString.indexOf(",") + 1, rgbString.nthIndexOf(",", 2)))
    const B = parseInt(rgbString.substring(rgbString.nthIndexOf(",", 2) + 1, rgbString.nthIndexOf(",", 3)))
    const A = parseInt(rgbString.substring(rgbString.nthIndexOf(",", 3) + 1, rgbString.nthIndexOf(")", 1)))
    return { r: R, g: G, b: B, a: A }
}

function slideValue(value, bound, variability, additive, sporadic) {
    let shift = sporadic ? (Math.round((Math.random() - .5) * variability)) : Math.round(Math.random() * variability)
    result = additive ? value + shift : value - shift
    if (result > bound) {
        return bound - (result - bound)
    }
    else if (result < 0) {
        return Math.abs(result)
    }
    return result
}