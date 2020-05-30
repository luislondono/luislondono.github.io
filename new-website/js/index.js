var googleMapsBackground
var workCarousel
var resume
const baysideAnchor = (550 / 776)

const myWork = [
 {
  icon: "uber_icon.png",
  name: "Uber Customer Obsesion",
  link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io"
 },
 {
  icon: "hyperloop_webdev_logo.png",
  name: "Cornell Hyperloop",
  link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io"
 },
 {
  icon: "snakes_and_ladders.png",
  name: "Snakes & Ladders",
  link: "https://github.com/IceJinx33/Snakes-and-Ladders#snakes-and-ladders"
 },
 {
  icon: "rush_hour_logo.jpg",
  name: "Gridlock!",
  link: "https://luislondono.com/gridLockGame"
 },
 {
  icon: "snakes_and_ladders2.png",
  name: "Snakes & Ladders",
  link: "https://github.com/IceJinx33/Snakes-and-Ladders#snakes-and-ladders"
 },
 {
  icon: "egos_icon.png",
  name: "OS Practicum",
  link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io"
 },
 {
  icon: "ocaml_icon.svg",
  name: "OCaml Repl",
  link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io"
 },
 {
  icon: "c_icon.png",
  name: "Malloc Library",
  link: "https://github.com/cornellhyperloop/cornellhyperloop.github.io"
 },
]
window.onresize = () => {
 pageSpecificOnload()
}

function pageSpecificOnload() {
 googleMapsBackground = document.getElementById("google-maps-background")
 workCarousel = document.getElementById("work-carousel")
 resume = document.getElementById("resume")

 generateCarousel()

 anchorGoogleMapsBackground()
}

function anchorGoogleMapsBackground() {
 googleMapsBackground.style.position = "absolute"
 const imageWidth = googleMapsBackground.getBoundingClientRect().width
 const horizontalAnchor = window.innerWidth * .65
 var shift = baysideAnchor * imageWidth - horizontalAnchor
 shift = Math.min(shift, imageWidth - window.innerWidth)
 console.log("Baysude is at " + String(baysideAnchor * imageWidth))
 console.log("Shift is " + shift)
 googleMapsBackground.style.left = "-" + String(shift) + "px"
}


function generateCarousel() {

 iconHeight = getComputedStyle(document.documentElement).getPropertyValue('--carousel-icon-height')
 mult = getComputedStyle(document.documentElement).getPropertyValue('--carousel-item-width-mult')
 itemWidth = parseInt(iconHeight) * parseFloat(mult)

 numItems = Math.floor(document.documentElement.getBoundingClientRect().width / itemWidth)

 workCarousel.style.width = String(numItems * itemWidth) + "px"
 console.log("num items: " + String(numItems) + " width : " + String(numItems * itemWidth) + "px")

 resume.style.width = String(numItems * itemWidth) + "px"

 if (workCarousel.childElementCount < myWork.length) {
  myWork.forEach(elm => generateCarouselItem(workCarousel, elm))
 }
}

function generateCarouselItem(root, work) {
 workCarouselItem = document.createElement('div')
 workCarouselItem.classList.add("work-carousel-item")

 workCarouselItemImage = document.createElement('div')
 workCarouselItemImage.classList.add("work-carousel-item-image", "horizontal-centered")

 anchor = document.createElement("a")
 anchor.href = work.link

 icon = document.createElement("img")
 icon.src = "./assets/" + work.icon
 anchor.appendChild(icon)
 workCarouselItemImage.appendChild(anchor)

 workCarouselItem.appendChild(workCarouselItemImage)

 label = document.createElement("span")
 label.classList.add("work-carousel-item-label", "text-centered")
 label.innerText = work.name

 workCarouselItem.appendChild(label)

 root.appendChild(workCarouselItem)
}