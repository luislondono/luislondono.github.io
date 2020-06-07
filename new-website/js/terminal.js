var terminalTitleBar;
var terminalContainer;
var terminalBody;
var pageContent;

<<<<<<< HEAD
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

	constructor(container) {
		this.terminalKey = "terminal-" + generateTerminalID();
		this.container = container;
		container.id = this.terminalKey;
		container.style.zIndex = terminals.length;
		this.titlebar = container.getElementsByClassName("terminal-title-bar")[0];
		this.navigationButtons = container.getElementsByClassName(
			"navigation-buttons"
		)[0];
		this.titleContainer = container.getElementsByClassName(
			"terminal-title-container"
		)[0];

		terminals.push(this);
		terminalDict[container.id] = this;
	}
}

terminals = [];
terminalDict = {};
=======
var terminals = []
var terminalDict = {}

var activeDragWindow = undefined;
var activeTerminalInput = undefined;

var dragItem;
var terminalIDcounter = 0;
var clipboard = ""


>>>>>>> 697cdbe7ab27efa0d03944069ca5e8787dff2b86

commands = {
  "help"  : executeHelp,
  "home"  : executeGo,
  "go"    : executeGo,
  "exit"  : closeTerminal
}

<<<<<<< HEAD
var dragItem;
var container;

var terminalIDcounter = 0;

function pageSpecificOnload() {
	// console.log("Loading Terminal...")
	pageContent = document.getElementById("page-content");
	// terminalTitleBar = document.getElementsByClassName('terminal-title-bar')[0]

	generateTerminal();

	dragItem = document.getElementsByClassName("terminal-container")[0];
	terminalContainer = document.getElementsByClassName("terminal-container")[0];

	document.documentElement.addEventListener("mousedown", (e) => dragStart(e));
	document.documentElement.addEventListener("mouseup", (e) => dragEnd(e));
	document.documentElement.addEventListener("mousemove", (e) => drag(e));
}

function generateTerminal() {
	const terminalContainer = generateNode(
		"div",
		pageContent,
		"terminal-container"
	);
	const terminalTitleBar = generateNode(
		"div",
		terminalContainer,
		"terminal-title-bar"
	);
	const navButtons = generateNode(
		"div",
		terminalTitleBar,
		"terminal-title-navigation-buttons"
	);
	const close = generateNode(
		"div",
		navButtons,
		"terminal-title-nav-button close"
	);
	const minimize = generateNode(
		"div",
		navButtons,
		"terminal-title-nav-button minimize"
	);
	const expand = generateNode(
		"div",
		navButtons,
		"terminal-title-nav-button expand"
	);
	const terminalTitleContainer = generateNode(
		"div",
		terminalTitleBar,
		"terminal-title-container"
	);
	const terminalTitleIcon = generateNode(
		"img",
		terminalTitleContainer,
		"terminal-title-icon"
	);
	terminalTitleIcon.src = "./assets/terminal_icons/folder_icon.png";
	const terminalTitleText = generateNode(
		"span",
		terminalTitleContainer,
		"terminal-title-text",
		"luislondono.com -- bash"
	);
	const terminalBody = generateNode("div", terminalContainer, "terminal-body");
	const terminalText = generateNode(
		"div",
		terminalBody,
		"terminal-text",
		"luislondono.com ~: user$\nhello"
	);

	terminalContainerRect = terminalContainer.getBoundingClientRect();
	terminalContainer.style.top =
		(window.innerHeight - terminalContainerRect.height) / 2 + "px";
	terminalContainer.style.left =
		(window.innerWidth - terminalContainerRect.width) / 2 + "px";

	terminalObj = new Terminal(terminalContainer);

	terminalBody.addEventListener("click", (e) => {
		handleActiveTerminal(true, terminalContainer);
	});
	close.addEventListener("click", (e) => {
		closeTerminal(terminalContainer);
	});
}

function dragStart(e) {
	console.log(e.target);
	// if (e.target.classList.contains('terminal-title-bar')) {
	//  // Clicked on terminal title bar
	//  activeDragWindow = e.target.parentNode.id
	//  terminalDict[e.target.parentNode.id].initialCursorX = e.clientX
	//  terminalDict[e.target.parentNode.id].initialCursorY = e.clientY
	//  // Bring to front
	// }

	if (e.target.classList.value.substring(0, 8) == "terminal") {
		// Clicked on some terminal
		const selTerminalID = findTerminalIDfromTarget(e.target);
		if (e.target.classList.value.substring(0, 14) == "terminal-title") {
			// Clicked on terminal title bar
			activeDragWindow = selTerminalID;
			terminalDict[selTerminalID].initialCursorX = e.clientX;
			terminalDict[selTerminalID].initialCursorY = e.clientY;
			// Bring to front
		}
		terminalIndex = 0;

		for (let index = 0; index < terminals.length; index++) {
			if (terminals[index].terminalKey === selTerminalID) {
				terminalIndex = index;
				break;
			}
		}
		terminals.splice(terminalIndex, 1);
		terminals.push(terminalDict[selTerminalID]);

		// console.log("Reseting z indices")
		for (let i = 0; i < terminals.length; i++) {
			// console.log("z-index : " + String(i) + " = " + terminals[i].terminalKey)
			terminals[i].container.style.zIndex = String(i);
		}
	} else {
		handleActiveTerminal(false);
	}
}

function findTerminalIDfromTarget(target) {
	if (target.classList.contains("terminal-container")) {
		return target.id;
	}
	if (target.id == "page-content") {
		return undefined;
	}
	return findTerminalIDfromTarget(target.parentElement);
}

function dragEnd(e) {
	if (activeDragWindow != undefined) {
		terminalDict[activeDragWindow].initialCursorX = undefined;
		terminalDict[activeDragWindow].initialCursorY = undefined;

		translateXY = getTransformValues(
			terminalDict[activeDragWindow].container.style.transform
		);
		terminalDict[activeDragWindow].translateX = translateXY[0];
		terminalDict[activeDragWindow].translateY = translateXY[1];

		activeDragWindow = undefined;
	}
}

function drag(e) {
	if (activeDragWindow != undefined) {
		currentX = e.clientX - terminalDict[activeDragWindow].initialCursorX;
		currentY = e.clientY - terminalDict[activeDragWindow].initialCursorY;
		// console.log("Client X,Y = " + e.clientX + ", " + e.clientY)
		// console.log("DelX,DelY = " + (currentX) + ", " + currentY)

		moveTerminal(currentX, currentY, terminalDict[activeDragWindow]);
	}
}

function moveTerminal(dX, dY, terminalObject) {
	minTranslateY = -1 * parseInt(terminalObject.container.style.top);
	terminalObject.container.style.transform = `translateX(${
		terminalObject.translateX + dX
	}px) translateY(${Math.max(
		terminalObject.translateY + dY,
		minTranslateY
	)}px)`;
}

function getTransformValues(transformString) {
	result = [];
	transformString.split(" ").forEach((elm) => {
		result.push(parseInt(elm.substring(11)));
	});
	return result;
}

function handleActiveTerminal(state, terminalContainer) {
	activeTerminalInput = state;
	if (activeTerminalInput) {
		console.log("Terminal active:");
		console.log(terminalContainer);
	} else {
		console.log("No terminal active");
	}
}

function blinkCursor() {}

function generateTerminalID() {
	return terminalIDcounter++;
}

function closeTerminal(termContainer) {
	console.log("closing terminal");
	console.log(termContainer);
	tIndex = -1;
	for (let i = 0; i < terminals.length; i++) {
		if (terminals[i].terminalKey == termContainer.id) {
			tIndex = i;
			break;
		}
	}
	terminals.splice(tIndex, 1);
	delete terminalDict[termContainer.id];
	termContainer.remove();
}
=======
helpDocs = {
  "help": `help lists out all the commands offered to you in llash. Good work on finding this!`,
  "home": `'home' takes you to my home page, luislondono.com`,
  "exit": `exit closes out the terminal instance. `
}
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
    this.terminalBody = container.querySelector(".terminal-body")
    this.terminalCursor = container.querySelector(".terminal-cursor")
    this.terminalText = container.querySelector(".terminal-text")
    this.terminalTextContent = container.querySelector(".terminal-text-content")
    this.systemString = "luislondono.com"
    this.directoryString = "~"
    this.buffer = ""
    this.lastKey = undefined
    generateNewPrompt(this,true)


    terminals.push(this)
    terminalDict[container.id] = this
  }
}




function pageSpecificOnload() {
  // console.log("Loading Terminal...")
  pageContent = document.getElementById('page-content')
  // terminalTitleBar = document.getElementsByClassName('terminal-title-bar')[0]

  generateTerminal()


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
  const terminalTitleText = generateNode("span", terminalTitleContainer, "terminal-title-text", `luislondono.com terminal-${terminalIDcounter} -- bash ` )
  const terminalBody = generateNode("div", terminalContainer, "terminal-body")
  const terminalText = generateNode("div", terminalBody, "terminal-text")
  const terminalTextContent = generateNode("text",terminalText,"terminal-text-content")
  const terminalCursor = generateNode("span",terminalText,"terminal-cursor transparent","▋")



  const terminalContainerRect = terminalContainer.getBoundingClientRect()
  terminalContainer.style.top = (window.innerHeight - terminalContainerRect.height)/ 2 + 8 * terminalIDcounter+ "px"
  terminalContainer.style.left = (window.innerWidth - terminalContainerRect.width) / 2 + 8 * terminalIDcounter+ "px"

  const terminalObj = new Terminal(terminalContainer)

  terminalBody.addEventListener("click", (e) => {
    handleActiveTerminal(true, terminalContainer)
  })
  terminalTextContent.addEventListener("onpaste", (e) => {
    console.log("pasting...")
  })
  close.addEventListener("click", (e) => {
    closeTerminal([],terminalObj)
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
    terminalDict[activeDragWindow].terminalText.style.position = "static"
    moveTerminal(currentX, currentY, terminalDict[activeDragWindow])
    terminalDict[activeDragWindow].terminalText.style.position = ""
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
    // console.log("Terminal active:")
    // console.log(terminalContainer)
  } else {
    // console.log("No terminal active")
    if (activeTerminalInput) {
      // console.log("Clearing " + activeTerminalInput)
      clearInterval(terminalDict[activeTerminalInput].blinkerTimer)
      document.documentElement.removeEventListener("keydown",readInput)
      activeTerminalInput = undefined;
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


function closeTerminal(tokens, tObject, fixLayering = true) {
  console.log("closing terminal " + tObject.container.id)
  if (tokens.length == 2 && tokens[0] == "exit" && tokens[1] == "-a") {
    for (let i = 0; i < terminals.length; i++) {
      closeTerminal([],terminals[i],false)
    }
    terminals = []
    terminalDict = {}
    terminalIDcounter = 0
    activeTerminalInput = undefined
    return
  }
  if (fixLayering) {
    tIndex = -1;
    for (let i = 0; i < terminals.length; i++) {
      if (terminals[i].terminalKey == tObject.id) {
        tIndex = i
        break
      }
    }
    terminals.splice(tIndex, 1)
  }
  if (tObject.id == activeTerminalInput) {
    clearInterval(tObject.blinkerTimer)
  }

  delete terminalDict[tObject.id]
  tObject.container.remove()
}

async function readInput(e) {
  if (activeTerminalInput) {
    // console.log(e)
    if (terminalDict[activeTerminalInput].lastKey == "Meta") {
      switch (e.key) {
        case "v":
          pasteToTerminal(terminalDict[activeTerminalInput])
          break;

        default:
          break;
      }
      terminalDict[activeTerminalInput].lastKey = undefined;
      return
    }
    switch (e.key) {
      case "Enter":
        generateNewPrompt(terminalDict[activeTerminalInput])
        break;
      case "Backspace":
        if (terminalDict[activeTerminalInput].buffer.length != 0) {
          terminalDict[activeTerminalInput].buffer = terminalDict[activeTerminalInput].buffer.slice(0, -1)
          terminalDict[activeTerminalInput].terminalTextContent.innerText = terminalDict[activeTerminalInput].terminalTextContent.innerText.slice(0,-1)
        }
        break;
      case "Tab":
        break;
      case "Meta":
        terminalDict[activeTerminalInput].lastKey = "Meta"
        break;

      default:
        console.log("Typing " + e.key )
        terminalDict[activeTerminalInput].terminalTextContent.innerText += e.key
        terminalDict[activeTerminalInput].buffer += e.key
        break;
    }
  }
}

function generateNewPrompt(terminalObject, first = false) {
  if (!first) {
    stdOut(terminalObject, "", true)
    parseBuffer(terminalObject)
  }
  terminalObject.terminalTextContent.innerText += (first ? "" : "\n") + terminalObject.systemString + ": " + terminalObject.directoryString + " user $ "
  terminalObject.buffer = ""
}

function parseBuffer(tObject) {
  console.assert(tObject instanceof Terminal, "parseBuffer was not handed a Terminal Object")
  tokens = tObject.buffer.split(" ")
  console.log(tokens)
  execute(tokens,tObject)
}

function executeHelp(tokens, tObject) {
  console.assert(tObject instanceof Terminal, "executeHelp was not handed a Terminal Object")
  var helpString = ""
  if (tokens.length == 1) {
    helpString = `llash terminal, version 2.0
    This shell is a frontend project by Luis Londono.
    You can learn more about the project at github.com/luislondono.
    These commands are defined internally by Luis.

    `
    for (var key in commands) {
      if (commands.hasOwnProperty(key)) {
        console.log(key)
        helpString += key + "\n"
      }
    }
  }
  else {
    for (let i = 1; i < tokens.length; i++) {
      if (helpDocs.hasOwnProperty(tokens[i])){
        helpString += helpDocs[tokens[i]] + "\n"
      }
    }
  }
  stdOut(tObject,helpString)
}

function executeUnknown(tokens, tObject) {
  console.assert(tObject instanceof Terminal, "executeUnknown was not handed a Terminal Object")
  stdOut(tObject, `-llash: ${tokens[0]} : command not found. For a list of commands, type 'help'`)
}


function stdOut(tObject, buffer, newline) {
  console.assert(tObject instanceof Terminal, "stdOut was not handed a Terminal Object")
  console.log("pushing buffer" + buffer + "to stdout")
  console.log(tObject)
  tObject.terminalTextContent.innerText += buffer
  if (newline) {
    tObject.terminalTextContent.innerText += "\n"
  }
}

function execute(tokens, tObject) {
  console.assert(tObject instanceof Terminal, "Execute was not handed a Terminal Object")
  console.log("executing...")
  if (commands.hasOwnProperty(tokens[0])) {
    commands[tokens[0]](tokens, tObject)
  }
  else {
    executeUnknown(tokens,tObject)
  }
  scrollTerminalToBottom(tObject)
}

function executeGo(tokens, tObject) {
  switch (tokens.length) {
    case 1:
      document.location.href = "http://www.luislondono.com"
      break;
    case 2:
      document.location.href = "http://" + tokens[1]
    default:
      break;
  }
}

function pasteToTerminal(tObject) {
  console.log("pasting...")
  console.log(tObject.terminalTextContent)
  navigator.clipboard.readText().then(clipboard => {
    tObject.terminalTextContent.innerText += clipboard
    tObject.buffer += clipboard
  })
}

function scrollTerminalToBottom(tObject) {
  tObject.terminalBody.scrollTop = tObject.terminalBody.scrollHeight
}





>>>>>>> 697cdbe7ab27efa0d03944069ca5e8787dff2b86
