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

    document.getElementById("page-content").insertAdjacentElement('beforeend', checkersBoard)

}

function handleSelectPiece(checkerDiv) {
    // console.log(event.target)
    checkerID = event.target.id
    checkerPosition = piecesState[checkerID]

    console.log(`checkerID : ${checkerID}, position:(${piecesState[checkerID][0]},${piecesState[checkerID][1]})`)
    // console.log(`Possible Moves: ${genPossibleMoves(checkerPosition)}`)

    // if checkerID
    moves = genPossibleMoves(checkerPosition)
    // console.log(moves)
    moves.forEach(coord => {
        toggleTileHighlight(coord)
    })

}

function genPossibleMoves(position) {
    result = []
    // North-West
    nwPosition = [position[0] - 1, position[1] - 1]
    // NortiEast
    nePosition = [position[0] + 1, position[1] + 1]
    // SoutiWest
    swPosition = [position[0] - 1, position[1] - 1]
    // SoutiEast
    sePosition = [position[0] + 1, position[1] - 1]
    positions = [
        [position[0] - 1, position[1] - 1],
        [position[0] + 1, position[1] - 1],
        [position[0] - 1, position[1] + 1],
        [position[0] + 1, position[1] + 1],
    ]
    positions.forEach(position => {
        if (isValidCoordinate(position) && (pieceAtPosition(position) == null)) {
            result.push(position)
        }
    });

    return result

}

function isValidCoordinate(coord) {
    return coord[0] <= 7 && coord[0] >= 0 && coord[1] <= 7 && coord[1] >= 0
}

function pieceAtPosition(targetCoord) {
    for (const piece in piecesState) {
        if (piecesState.hasOwnProperty(piece)) {
            const pieceCoord = piecesState[piece];
            // console.log(pieceCoord)
            if (pieceCoord[0] == targetCoord[0] && pieceCoord[1] == targetCoord[1]) {
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
    tile.style.border = (tile.style.border == "3px solid red") ? "" : "3px solid red"
}