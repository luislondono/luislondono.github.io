var firebaseConfig = {
    apiKey: "AIzaSyCSFoOcUMAULAn6ScMSgygfS_fZcnVTpSk",
    authDomain: "luislondono-com.firebaseapp.com",
    databaseURL: "https://luislondono-com.firebaseio.com",
    projectId: "luislondono-com",
    storageBucket: "luislondono-com.appspot.com",
    messagingSenderId: "851373763529",
    appId: "1:851373763529:web:c171fe15b7d82883"
};

var gameInitializerContainer;
var boardState;
var piecesState = {};
var primaryPieceCount = 0
var secondaryPieceCount = 0
var toggledTileIDS = []
var selectedPieceID = null;
var lockedSelectedPieceID = null;
var possibleMoves = null;
var currentTurn = 0
var initialTimeSeconds = 309
var primaryStopwatchTime = initialTimeSeconds;
var secondaryStopwatchTime = initialTimeSeconds;



setupSpecificPage = function () {
    console.log("Setting up Checkers.html")
    firebase.initializeApp(firebaseConfig);
    gameInitializerContainer = document.getElementsByClassName("game-initiation-button-container")[0]
    handleCreateNewGame()
}

function handleCreateNewGame() {
    gameInitializerContainer.style.display = "none"
    drawCheckersBoard()
    setupStopWatches()
}

function handleJoinGame() {

}

function drawCheckersBoard() {
    var checkersBoard = document.createElement('div')
    checkersBoard.classList.add("checkers-board")




    for (let row = 0; row < 8; row++) {
        var checkersRow = document.createElement('div')
        checkersRow.classList.add("checkers-row")
        for (let square = 0; square < 8; square++) {
            var checkersSquare = createCheckerSquare(square, 7 - row)
            // var checkersSquare = document.createElement('div')
            // checkersSquare.classList.add("checkers-square")

            switch (row) {
                case 0:
                    if (square % 2 == 1) {
                        createChecker(false, checkersSquare, square, 7 - row)
                    }
                    break;
                case 1:
                    if (square % 2 == 0) {
                        createChecker(false, checkersSquare, square, 7 - row)
                    }
                    break;
                case 2:
                    if (square % 2 == 1) {
                        createChecker(false, checkersSquare, square, 7 - row)
                    }
                    break;
                case 5:
                    if (square % 2 == 0) {
                        createChecker(true, checkersSquare, square, 7 - row)
                    }
                    break;
                case 6:
                    if (square % 2 == 1) {
                        createChecker(true, checkersSquare, square, 7 - row)
                    }
                    break;
                case 7:
                    if (square % 2 == 0) {
                        createChecker(true, checkersSquare, square, 7 - row)
                    }
                    break;
            }


            checkersRow.appendChild(checkersSquare)
        }
        checkersBoard.appendChild(checkersRow)
    }

    document.getElementById("checkers-board-container").insertAdjacentElement('afterbegin', checkersBoard)
}

function handleSelectPiece() {
    // console.log(event.target)
    checkerID = event.target.id
    checkerPosition = piecesState[checkerID]

    currentTurnSide = checkerID.substring(0, 7) == "primary" ? 0 : 1
    if (currentTurnSide != currentTurn) {
        console.warn("Trying to move a piece not during the correct turn!")
        return
    }

    if (lockedSelectedPieceID != null && checkerID != lockedSelectedPieceID) {
        console.warn("You must move piece: ", lockedSelectedPieceID)
        return
    }

    // if checkerID
    if (selectedPieceID == null) {
        selectedPieceID = checkerID
        possibleMoves = genPossibleMoves(checkerPosition)
        possibleMoves.forEach(coord => {
            toggleTileHighlight(coord)
        })
    }
    else {
        if (checkerID != selectedPieceID) {
            console.warn("Selected piece that wasn't currently selected")
            return
        }
        else {
            selectedPieceID = null;
            possibleMoves = genPossibleMoves(checkerPosition)
            possibleMoves.forEach(coord => {
                toggleTileHighlight(coord)
            })
        }
    }
    // console.log(moves)

}

function genPossibleMoves(checkerData) {
    if (!checkerData.hasOwnProperty("x") || !checkerData.hasOwnProperty("y") || !checkerData.hasOwnProperty("king")) {
        throw error;
        console.error("checkerData not in correct format!")
        return
    }
    console.log("generating possible moves for position: ", checkerData)
    pieceID = pieceIDAtPosition([checkerData["x"], checkerData["y"]])
    result = []
    targetPositions = [
        [checkerData["x"] - 1, checkerData["y"] - 1],
        [checkerData["x"] + 1, checkerData["y"] - 1],
        [checkerData["x"] - 1, checkerData["y"] + 1],
        [checkerData["x"] + 1, checkerData["y"] + 1],
    ]
    console.log(targetPositions)


    targetPositions.forEach(potentialTarget => {
        if (!isValidCoordinate(potentialTarget)) {
            return;
        }

        pieceIDAtTargetPosition = pieceIDAtPosition(potentialTarget)

        console.log(`Checking position (${potentialTarget[0]},${potentialTarget[1]})`)
        if (pieceIDAtTargetPosition == null) {
            result.push(potentialTarget)
        }
        if (pieceIDAtTargetPosition != null) {
            pieceIDAtTargetPositionSide = pieceIDAtTargetPosition.substring(0, 7) == "primary" ? 0 : 1

            if (pieceIDAtTargetPositionSide != currentTurn) {
                // Can skip over 'eat' oponent
                const eatOpponentPieceCoord = [checkerData["x"] + (2 * (potentialTarget[0] - checkerData["x"])),
                checkerData["y"] + (2 * (potentialTarget[1] - checkerData["y"]))]
                pieceAtEatOpponentPieceCoord = pieceIDAtPosition(eatOpponentPieceCoord)
                console.log("Can eat opponent and land on: ", eatOpponentPieceCoord)
                if (isValidCoordinate(eatOpponentPieceCoord) && pieceAtEatOpponentPieceCoord == null) {
                    result.push(eatOpponentPieceCoord)
                }
            }
        }
    })
    // console.log("Possible moves are: ")
    // console.log(result)
    return result
}

function isValidCoordinate(coord) {
    return coord[0] <= 7 && coord[0] >= 0 && coord[1] <= 7 && coord[1] >= 0
}

function pieceIDAtPosition(targetCoord) {
    for (const piece in piecesState) {
        if (piecesState.hasOwnProperty(piece)) {
            const pieceData = piecesState[piece];
            // console.log(pieceCoord)
            if (pieceData != null && pieceData.x == targetCoord[0] && pieceData.y == targetCoord[1]) {
                return piece
            }
        }
    }
    return null
}

function createChecker(isPrimary, checkerSquareElement, x, y) {
    var checker = document.createElement('button')
    checker.classList.add("checker")
    subClassName = isPrimary ? "primary-checker" : "secondary-checker"
    checker.classList.add(subClassName)

    checkerNumber = isPrimary ? primaryPieceCount : secondaryPieceCount
    if (isPrimary) { primaryPieceCount += 1 }
    else { secondaryPieceCount += 1 }
    checker.id = subClassName + checkerNumber

    piecesState[checker.id] = {
        "x": x,
        "y": y,
        "king": false,
    }

    checker.addEventListener('click', function (e) {
        handleSelectPiece(e.target)
    })
    checkerSquareElement.appendChild(checker)
}

function createCheckerSquare(x, y) {
    var checkersSquare = document.createElement('div')
    checkersSquare.classList.add("checkers-square")
    if (y % 2 == 0) {
        if (x % 2 == 0) {
            checkersSquare.classList.add("primary-square-2")
        }
        else {
            checkersSquare.classList.add("secondary-square-2")
        }
    }
    else {
        if (x % 2 == 0) {
            checkersSquare.classList.add("secondary-square-2")
        }
        else {
            checkersSquare.classList.add("primary-square-2")
        }
    }

    checkersSquare.id = `checkers-square-${x}-${y}`
    return checkersSquare
}

function toggleTileHighlight(coord) {
    tile = document.getElementById(`checkers-square-${coord[0]}-${coord[1]}`)

    if (!toggledTileIDS.includes(tile.id)) {
        toggledTileIDS.push(tile.id)
        tile.classList.add("toggled-tile")
        tile.onclick = function (event) {
            moveSelectedPieceToTile(event.target)
        }
    }
    else {
        toggledTileIDS.splice(toggledTileIDS.indexOf(tile.id), 1)
        tile.classList.remove("toggled-tile")
        tile.onclick = undefined;
    }

}

function moveSelectedPieceToTile(tileElement) {
    selectedPiece = document.getElementById(selectedPieceID)
    selectedPieceData = piecesState[selectedPieceID]
    destinationTileCoord = getCoordFromTileElement(tileElement)
    const eatOpponentMove = Math.abs(selectedPieceData["x"] - destinationTileCoord[0]) > 1
    if (eatOpponentMove) {
        console.log("Eating an opponent")
    }
    event.target.appendChild(selectedPiece)
    // Untoggle current possible Moves
    possibleMoves.forEach(coord => toggleTileHighlight(coord))
    const eatenPieceCoord = [
        selectedPieceData["x"] + ((destinationTileCoord[0] - selectedPieceData["x"]) / 2),
        selectedPieceData["y"] + ((destinationTileCoord[1] - selectedPieceData["y"]) / 2)
    ]
    piecesState[selectedPieceID]["x"] = destinationTileCoord[0]
    piecesState[selectedPieceID]["y"] = destinationTileCoord[1]
    if (eatOpponentMove) {
        // console.log(`Current Position ${selectedPieceCoord} , target Position: ${destinationTileCoord} , eat Position: ${eatenPieceCoord}`)

        removePieceAtPosition(eatenPieceCoord)
        lockedSelectedPieceID = selectedPieceID;

        possibleMoves = genPossibleMoves({
            "x": destinationTileCoord[0],
            "y": destinationTileCoord[1],
            "king": selectedPieceData["king"]
        })
        console.log("Retoggling after an eat move: ", possibleMoves)
        possibleMoves.forEach(coord => {
            toggleTileHighlight(coord)
        })

    }
    else {

        console.log("Changing turn")
        handleChangeTurn()
    }

    if (primaryStopwatchTime == initialTimeSeconds && secondaryStopwatchTime == initialTimeSeconds) {
        setInterval(() => { updateStockWatch() }, 1000)
    }

}

function getCoordFromTileElement(tileElement) {
    idLength = tileElement.id.length
    x = parseInt(tileElement.id.substring(idLength - 3, idLength - 2))
    y = parseInt(tileElement.id.substring(idLength - 1, idLength))
    return [x, y]
}

function removePieceAtPosition(coord) {
    console.log(`Removing piece at ${coord}`)
    eatenPieceID = pieceIDAtPosition(coord)
    piecesState[eatenPieceID] = null
    eatenPiece = document.getElementById(eatenPieceID)
    eatenPiece.remove()
}

function handleChangeTurn() {
    console.log("Turn has changed")
    prevTurnString = (currentTurn == 0) ? "primary" : "secondary"
    currentTurn = (currentTurn + 1) % 2
    currentTurnString = (currentTurn == 0) ? "primary" : "secondary"
    turnInfoChecker = document.getElementsByClassName("game-info-player-turn-container")[0].children[0]
    turnInfoChecker.classList.remove(prevTurnString + "-checker")
    turnInfoChecker.classList.add(currentTurnString + "-checker")
    lockedSelectedPieceID = null;
    selectedPieceID = null;
    possibleMoves = null;
}

function updateStockWatch() {
    // console.log("Updating stop-watch")
    const currentPlayer = currentTurn == 0 ? "primary" : "secondary"
    let minutes;
    let secs;
    if (currentTurn == 0) {
        primaryStopwatchTime -= 1
        secs = primaryStopwatchTime % 60
        minutes = (primaryStopwatchTime - (primaryStopwatchTime % 60)) / 60
    }
    else {
        secondaryStopwatchTime -= 1
        secs = secondaryStopwatchTime % 60
        minutes = (secondaryStopwatchTime - (secondaryStopwatchTime % 60)) / 60
    }
    stopwatch = document.getElementById(currentPlayer + "-player-info").getElementsByClassName("player-stop-watch")[0]
    stopwatch.children[0].innerText = minutes
    stopwatch.children[2].innerText = (secs < 10) ? "0" + secs : secs;
}

function setupStopWatches() {
    primaryStopwatch = document.getElementById("primary-player-info").getElementsByClassName("player-stop-watch")[0]
    secondaryStopwatch = document.getElementById("secondary-player-info").getElementsByClassName("player-stop-watch")[0]

    primarySeconds = primaryStopwatchTime % 60
    primaryMinutes = (primaryStopwatchTime - (primaryStopwatchTime % 60)) / 60
    secondarySeconds = secondaryStopwatchTime % 60
    secondaryMinutes = (secondaryStopwatchTime - (secondaryStopwatchTime % 60)) / 60

    console.log(`stopwatch P: ${primaryStopwatchTime}, stopwatch S: ${secondaryStopwatchTime}`)

    primaryStopwatch.children[0].innerText = primaryMinutes
    primaryStopwatch.children[2].innerText = primarySeconds < 10 ? "0" + primarySeconds : primarySeconds;

    secondaryStopwatch.children[0].innerText = secondaryMinutes;
    secondaryStopwatch.children[2].innerText = secondarySeconds < 10 ? "0" + secondarySeconds : secondarySeconds;
}
