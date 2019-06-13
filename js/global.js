var mobileMenuCollapsed = true;
const navBarDiv = '<div class="navbar-container"> <nav id="nav-bar-desktop"> <div class="navbar-logo"> <a href="https://luislondono.com/">Luis Hernando Londono</a> </div> <ul> <li class="nav-link"><a href="https://luislondono.com/">Home</a></li> <li class="nav-link"><a href="https://docs.google.com/document/d/1av1XlOl_ZTY2W7YGD1Kn3YUUMBhXLhLa5DjAMa0V2_I/edit?usp=sharing">Resume</a> </li> <li class="nav-link"><a href="myWork">My Work</a></li> <li class="nav-link" id="dropdown-content">Gallery</li> <li class="social-media-link" id="github-link"> <a href="https://www.github.com/LuisLondono"></a> </li> <li class="social-media-link" id="facebook-link"> <a href="https://www.facebook.com/luislondonoramos"></a> </li> <li class="social-media-link" id="linkedin-link"> <a href="https://www.linkedin.com/in/luislondonoramos"></a> </li> </ul> </nav> <nav id="nav-bar-mobile"> <div id="nav-bar-mobile-horizontal-menu"> <div id="mobile-menu-icon-container"> <div class="hamburger-bun" id="bun-1-collapsed"></div> <div class="hamburger-bun" id="bun-2-collapsed"></div> <div class="hamburger-bun" id="bun-3-collapsed"></div> </div> <div class="navbar-logo" id="logo-first-middle-last"> <a href="https://luislondono.com/">Luis Hernando Londono</a> </div> <div class="navbar-logo" id="logo-first-last"> <a href="https://luislondono.com/">Luis Londono</a> </div> </div> <div class="mobile-menu-container" id="mobile-menu-container-collapsed"> <ul> <li class="nav-link"> <a href="https://luislondono.com/"> Home </a> </li> <li class="nav-link"> <a href="https://docs.google.com/document/d/1av1XlOl_ZTY2W7YGD1Kn3YUUMBhXLhLa5DjAMa0V2_I/edit?usp=sharing"> Resume </a> </li> <li class="nav-link"> <a href="myWork"> My Work </a> </li> <li class="nav-link"> <a href="myWork"> Gallery </a> </li> </ul> </div> </nav> </div>'

const footerMenuDiv = '<div id="page-footer-navigator"> <ul> <li class="social-media-link" id="github-link"> <a href="https://www.github.com/LuisLondono"></a> </li> <li class="social-media-link" id="facebook-link"> <a href="https://www.facebook.com/luislondonoramos"></a> </li> <li class="social-media-link" id="linkedin-link"> <a href="https://www.linkedin.com/in/luislondonoramos"></a> </li> </ul> </div>'

window.onload = function () {
    document.getElementsByTagName("header")[0].innerHTML = navBarDiv
    document.getElementById("page-content").insertAdjacentHTML("beforeend", footerMenuDiv)

    // Event listeners
    document.getElementById("mobile-menu-icon-container").addEventListener("click", handleMobileMenuIconClick)

    console.log("Added event listener to mobile-menu-icon-container")
    setupSpecificPage()
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


function handleMobileMenuIconClick() {
    bunElements = document.getElementsByClassName("hamburger-bun")

    if (mobileMenuCollapsed) {
        mobileMenuCollapsed = false
        for (let index = 1; index < 4; index++) {
            bun = bunElements[index - 1]
            bun.id = "bun-" + index + "-expanded"
        }
        console.log("Expanding mobile menu bar...")

        document.getElementsByClassName("mobile-menu-container")[0].id = "mobile-menu-container-expanded"
    }
    else {
        mobileMenuCollapsed = true
        for (let index = 1; index < 4; index++) {
            bun = bunElements[index - 1]
            bun.id = "bun-" + index + "-collapsed"
        }
        console.log("Collapsing mobile menu bar...")
        document.getElementsByClassName("mobile-menu-container")[0].id = "mobile-menu-container-collapsed"
    }
}