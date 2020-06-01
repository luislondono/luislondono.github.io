var terminalTitleBar
var terminalContainer
var terminalBody
var pageContent

class Terminal {
  beingDragged = false;
  currentX;
  currentY;
  translateX = 0;
  translateY = 0;
  initialCursorX;
  initialCursorY;
  xOffset = 0;
  yOffset = 0;
  blinkerTimer;

  constructor(container) {
    this.terminalKey = "terminal-" + generateTerminalID()
    this.container = container
    container.id = this.terminalKey
    container.style.zIndex = terminals.length
    this.titlebar = container.getElementsByClassName('terminal-title-bar')[0]
    this.navigationButtons = container.getElementsByClassName('navigation-buttons')[0]
    this.titleContainer = container.getElementsByClassName('terminal-title-container')[0]
    this.terminalCursor = container.querySelector(".terminal-cursor")
    this.terminalTextContent = container.querySelector(".terminal-text-content")


    terminals.push(this)
    terminalDict[container.id] = this
  }
}

terminals = []
terminalDict = {}

activeDragWindow = undefined;
activeTerminalInput = undefined;


var dragItem;
var container;


var terminalIDcounter = 0;



function pageSpecificOnload() {
  // console.log("Loading Terminal...")
  pageContent = document.getElementById('page-content')
  // terminalTitleBar = document.getElementsByClassName('terminal-title-bar')[0]

  generateTerminal()


  dragItem = document.getElementsByClassName('terminal-container')[0]
  terminalContainer = document.getElementsByClassName('terminal-container')[0]




  document.documentElement.addEventListener("mousedown", (e) => dragStart(e))
  document.documentElement.addEventListener("mouseup", (e) => dragEnd(e))
  document.documentElement.addEventListener("mousemove", (e) => drag(e))
}

function generateTerminal() {
  const terminalContainer = generateNode("div", pageContent, "terminal-container")
  const terminalTitleBar = generateNode("div", terminalContainer, "terminal-title-bar")
  const navButtons = generateNode("div", terminalTitleBar, "terminal-title-navigation-buttons")
  const close = generateNode("div", navButtons, "terminal-title-nav-button close")

  const minimize = generateNode("div", navButtons, "terminal-title-nav-button minimize")
  const expand = generateNode("div", navButtons, "terminal-title-nav-button expand")
  const terminalTitleContainer = generateNode("div", terminalTitleBar, "terminal-title-container")
  const terminalTitleIcon = generateNode("img", terminalTitleContainer, "terminal-title-icon")
  terminalTitleIcon.src = "./assets/terminal_icons/folder_icon.png"
  const terminalTitleText = generateNode("span", terminalTitleContainer, "terminal-title-text", "luislondono.com -- bash")
  const terminalBody = generateNode("div", terminalContainer, "terminal-body")
  const terminalText = generateNode("div", terminalBody, "terminal-text")
  const terminalTextContent = generateNode("text",terminalText,"terminal-text-content","luislondono.com ~: user$")
  const terminalCursor = generateNode("span",terminalText,"terminal-cursor transparent","▋")



  terminalContainerRect = terminalContainer.getBoundingClientRect()
  terminalContainer.style.top = (window.innerHeight - terminalContainerRect.height) / 2 + "px"
  terminalContainer.style.left = (window.innerWidth - terminalContainerRect.width) / 2 + "px"

  terminalObj = new Terminal(terminalContainer)

  terminalBody.addEventListener("click", (e) => {
    handleActiveTerminal(true, terminalContainer)
  })
  close.addEventListener("click", (e) => {
    closeTerminal(terminalContainer)
  })
}

function generateNode(type, parentNode, classString = "", innerText = "") {
  var node = document.createElement(type)
  if (classString != "") {
    node.classList.add(...classString.split(" "))
  }
  node.innerText = innerText
  parentNode.appendChild(node)
  return node
}

function dragStart(e) {
  // console.log(e)
  // if (e.target.classList.contains('terminal-title-bar')) {
  //  // Clicked on terminal title bar
  //  activeDragWindow = e.target.parentNode.id
  //  terminalDict[e.target.parentNode.id].initialCursorX = e.clientX
  //  terminalDict[e.target.parentNode.id].initialCursorY = e.clientY
  //  // Bring to front
  // }

  if (e.target.classList.value.substring(0, 8) == 'terminal') {
    // Clicked on some terminal
    const selTerminalID = findTerminalIDfromTarget(e.target)
    if (e.target.classList.value.substring(0, 14) == 'terminal-title') {
      // Clicked on terminal title bar
      activeDragWindow = selTerminalID
      terminalDict[selTerminalID].initialCursorX = e.clientX
      terminalDict[selTerminalID].initialCursorY = e.clientY
      // Bring to front
    }
    terminalIndex = 0;

    for (let index = 0; index < terminals.length; index++) {
      if (terminals[index].terminalKey === selTerminalID) {
        terminalIndex = index
        break
      };
    }
    terminals.splice(terminalIndex, 1)
    terminals.push(terminalDict[selTerminalID])

    // console.log("Reseting z indices")
    for (let i = 0; i < terminals.length; i++) {
      // console.log("z-index : " + String(i) + " = " + terminals[i].terminalKey)
      terminals[i].container.style.zIndex = String(i)
    }
  } else {
    handleActiveTerminal(false)
  }

}

function findTerminalIDfromTarget(target) {
  if (target.classList.contains('terminal-container')) {
    return target.id
  }
  if (target.id == "page-content") {
    return undefined
  }
  return findTerminalIDfromTarget(target.parentElement)
}

function dragEnd(e) {
  if (activeDragWindow != undefined) {

    terminalDict[activeDragWindow].initialCursorX = undefined;
    terminalDict[activeDragWindow].initialCursorY = undefined;


    translateXY = getTransformValues(terminalDict[activeDragWindow].container.style.transform)
    terminalDict[activeDragWindow].translateX = translateXY[0]
    terminalDict[activeDragWindow].translateY = translateXY[1]

    activeDragWindow = undefined;
  }

}

function drag(e) {
  if (activeDragWindow != undefined) {
    currentX = e.clientX - terminalDict[activeDragWindow].initialCursorX;
    currentY = e.clientY - terminalDict[activeDragWindow].initialCursorY;
    // console.log("Client X,Y = " + e.clientX + ", " + e.clientY)
    // console.log("DelX,DelY = " + (currentX) + ", " + currentY)


    moveTerminal(currentX, currentY, terminalDict[activeDragWindow])
  }
}

function moveTerminal(dX, dY, terminalObject) {
  minTranslateY = -1 * parseInt(terminalObject.container.style.top)
  terminalObject.container.style.transform =
    `translateX(${terminalObject.translateX + dX}px) translateY(${Math.max(terminalObject.translateY + dY, minTranslateY)}px)`

}

function getTransformValues(transformString) {
  result = []
  transformString.split(" ").forEach(elm => {
    result.push(parseInt(elm.substring(11)))
  });
  return result
}

function handleActiveTerminal(state, terminalContainer) {
  if (state) {
    if (activeTerminalInput != terminalContainer.id) {
      if (activeTerminalInput != undefined) {
        clearInterval(terminalDict[activeTerminalInput].blinkerTimer)
        if (!terminalDict[activeTerminalInput].terminalCursor.classList.contains('transparent')) {
          terminalDict[activeTerminalInput].terminalCursor.classList.add('transparent')
        }
      }
      activeTerminalInput = terminalContainer.id
      blinkCursor(terminalContainer)
      terminalDict[terminalContainer.id].blinkerTimer = setInterval(() => {
        blinkCursor(terminalContainer)
      }
      , 700)
    }
    document.documentElement.addEventListener("keydown", readInput)
    console.log("Terminal active:")
    console.log(terminalContainer)
  } else {
    console.log("No terminal active")
    if (activeTerminalInput) {
      console.log("Clearing " + activeTerminalInput)
      clearInterval(terminalDict[activeTerminalInput].blinkerTimer)
      document.documentElement.removeEventListener("keydown",readInput)
    }
  }
}

function blinkCursor(terminalContainer) {
  cursor = terminalContainer.querySelector('.terminal-cursor')
  cursor.classList.toggle("transparent")
}

function generateTerminalID() {
  return terminalIDcounter++
}

function closeTerminal(termContainer) {
  console.log("closing terminal")
  console.log(termContainer)
  tIndex = -1;
  for (let i = 0; i < terminals.length; i++) {
    if (terminals[i].terminalKey == termContainer.id) {
      tIndex = i
      break
    }
  }
  terminals.splice(tIndex, 1)
  delete terminalDict[termContainer.id]
  termContainer.remove()
}

function readInput(e) {
  if (activeTerminalInput) {
    terminalDict[activeTerminalInput].terminalTextContent.innerText += e.key
  }
}





