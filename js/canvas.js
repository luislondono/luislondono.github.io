window.onload = setupWindow
let canvas;
let mouseInfo;
function setupWindow() {
  canvas = document.getElementById("canvas")
  // setInterval(setCanvasBackgroundRandom, 10)
  // setCanvasBackgroundRandom()
  canvas.addEventListener("mousemove", updateCanvasColor)
  mouseInfo = document.getElementById("mouse-info")
}

function updateCanvasColor(e) {
  angle = getAngleOfElevation(e)

  // console.log(angleOfElevation)
  const newR = (((angle + 0) % 360) / 120) * 255
  const newG = (((angle + 120) % 360) / 120) * 255
  const newB = (((angle + 240) % 360) / 120) * 255
  console.log(newR, newG, newB)
  setCanvasBackgroundRandom(newR, newG, newB)
}

function setCanvasBackgroundRandom() {
  const r = Math.round(Math.random() * 255)
  const g = Math.round(Math.random() * 255)
  const b = Math.round(Math.random() * 255)
  randRGBString = "rgb(" + r + "," + g + "," + b + ")"
  canvas.style.backgroundColor = randRGBString
}

function setCanvasBackgroundRandom(r, g, b) {
  randRGBString = "rgb(" + r + "," + g + "," + b + ")"
  canvas.style.backgroundColor = randRGBString
}

function getAngleOfElevation(e) {
  centerX = window.innerWidth / 2
  centerY = window.innerHeight / 2
  let angleOfElevation;



  if ((centerY - e.clientY) < 0) {
    if ((e.clientX - centerX) < 0) {
      // Quadrant 3
      angleOfElevation = 180 + Math.atan((centerY - e.clientY) / (e.clientX - centerX)) * 180 / Math.PI
    }
    else {
      // Quadrant 4
      angleOfElevation = 360 + Math.atan((centerY - e.clientY) / (e.clientX - centerX)) * 180 / Math.PI
    }
  }
  else {
    if ((e.clientX - centerX) > 0) {
      // Quadrant 1
      angleOfElevation = Math.atan((centerY - e.clientY) / (e.clientX - centerX)) * 180 / Math.PI
    }
    else {
      // Quadrant 2
      angleOfElevation = 180 + Math.atan((centerY - e.clientY) / (e.clientX - centerX)) * 180 / Math.PI
    }
  }




  mouseInfo.innerText = `X: ${e.clientX - centerX}, Y: ${centerY - e.clientY} Angle: ${angleOfElevation}`

  return angleOfElevation
}