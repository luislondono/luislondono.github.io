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


setupSpecificPage = function () {
    console.log("Setting up Checkers.html")
    firebase.initializeApp(firebaseConfig);
    gameInitializerContainer = document.getElementsByClassName("game-initiation-button-container")[0]

}

function handleCreateNewGame() {
    gameInitializerContainer.style.display = "none"
    drawCheckersBoard()
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

    document.getElementsByClassName("game-initiation-button-container")[0].insertAdjacentElement('afterend', checkersBoard)

    // document.getElementById("page-content").insertAdjacentElement('afterbegin', checkersBoard)

}

function handleSelectPiece(checkerDiv) {
    // console.log(event.target)
    checkerID = event.target.id
    checkerPosition = piecesState[checkerID]

    currentTurnSide = checkerID.substring(0, 7) == "primary" ? 0 : 1
    if (currentTurnSide != currentTurn) {
        console.warn("Trying to move a piece not during the correct turn!")
        return
    }

    // console.log(`checkerID : ${checkerID}, position:(${piecesState[checkerID][0]},${piecesState[checkerID][1]})`)
    // console.log(`Possible Moves: ${genPossibleMoves(checkerPosition)}`)
    if (lockedSelectedPieceID != null && checkerID != lockedSelectedPieceID) {
        console.warn("You must move piece: ", lockedSelectedPieceID)
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

function genPossibleMoves(position) {
    pieceID = pieceIDAtPosition(position)
    result = []
    targetPositions = [
        [position[0] - 1, position[1] - 1],
        [position[0] + 1, position[1] - 1],
        [position[0] - 1, position[1] + 1],
        [position[0] + 1, position[1] + 1],
    ]
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
                const eatOpponentPieceCoord = [position[0] + (2 * (potentialTarget[0] - position[0])),
                position[1] + (2 * (potentialTarget[1] - position[1]))]
                pieceAtEatOpponentPieceCoord = pieceIDAtPosition(eatOpponentPieceCoord)
                if (isValidCoordinate(eatOpponentPieceCoord) && pieceAtEatOpponentPieceCoord == null) {
                    result.push(eatOpponentPieceCoord)
                }
            }
        }
    })
    console.log("Possible moves are: ")
    console.log(result)
    return result
}

function isValidCoordinate(coord) {
    return coord[0] <= 7 && coord[0] >= 0 && coord[1] <= 7 && coord[1] >= 0
}

function pieceIDAtPosition(targetCoord) {
    for (const piece in piecesState) {
        if (piecesState.hasOwnProperty(piece)) {
            const pieceCoord = piecesState[piece];
            // console.log(pieceCoord)
            if (pieceCoord != null && pieceCoord[0] == targetCoord[0] && pieceCoord[1] == targetCoord[1]) {
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

    piecesState[checker.id] = [x, y]

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
    selectedPieceCoord = piecesState[selectedPieceID]
    destinationTileCoord = getCoordFromTileElement(tileElement)
    eatOpponentMove = Math.abs(selectedPieceCoord[0] - destinationTileCoord[0]) > 1
    const eatenPieceCoord = [
        selectedPieceCoord[0] + ((destinationTileCoord[0] - selectedPieceCoord[0]) / 2),
        selectedPieceCoord[1] + ((destinationTileCoord[1] - selectedPieceCoord[1]) / 2)
    ]

    if (eatOpponentMove) {

        console.log(`Current Position ${selectedPieceCoord} , target Position: ${destinationTileCoord} , eat Position: ${eatenPieceCoord}`)

        removePieceAtPosition(eatenPieceCoord)
        lockedSelectedPieceID = selectedPieceID;

    }


    piecesState[selectedPieceID] = destinationTileCoord

    event.target.appendChild(selectedPiece)
    possibleMoves.forEach(coord => toggleTileHighlight(coord))


    if (eatOpponentMove) {
        possibleMoves = genPossibleMoves(destinationTileCoord)
        possibleMoves.forEach(coord => {
            toggleTileHighlight(coord)
        })

    }
    else {
        selectedPieceID = null;
        possibleMoves = null;
    }

    currentTurn = eatOpponentMove ? currentTurn : (currentTurn + 1) % 2
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