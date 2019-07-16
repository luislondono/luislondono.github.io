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

    primaryPieceCount = 0
    secondaryPieceCount = 0


    for (let row = 0; row < 8; row++) {
        var checkersRow = document.createElement('div')
        checkersRow.classList.add("checkers-row")
        for (let square = 0; square < 8; square++) {
            var checkersSquare = document.createElement('div')
            checkersSquare.classList.add("checkers-square")
            // console.log(`row: ${row % 2} , square: ${square % 2}`)
            var checker = document.createElement('button')
            checker.classList.add("checker")

            switch (row) {
                case 0:
                    if (square % 2 == 0) {
                        checker.classList.add("primary-checker")
                        checker.id = "primary-checker-" + primaryPieceCount
                        piecesState[checker.id] = [row, square]
                        checker.addEventListener('click', function (e) {
                            handleSelectPiece(e.target)
                        })
                        primaryPieceCount += 1
                        checkersSquare.appendChild(checker)
                    }
                    break;
                case 1:
                    if (square % 2 == 1) {
                        checker.classList.add("primary-checker")
                        checker.id = "primary-checker-" + primaryPieceCount
                        piecesState[checker.id] = [row, square]
                        checker.addEventListener('click', function (e) {
                            handleSelectPiece(e.target)
                        })
                        primaryPieceCount += 1
                        checkersSquare.appendChild(checker)
                    }
                    break;
                case 6:
                    if (square % 2 == 0) {
                        checker.classList.add("secondary-checker")
                        checker.id = "secondary-checker-" + secondaryPieceCount
                        piecesState[checker.id] = [row, square]
                        checker.addEventListener('click', function (e) {
                            handleSelectPiece(e.target)
                        })
                        secondaryPieceCount += 1
                        checkersSquare.appendChild(checker)
                    }
                    break;
                case 7:
                    if (square % 2 == 1) {
                        checker.classList.add("secondary-checker")
                        checker.id = "secondary-checker-" + secondaryPieceCount
                        piecesState[checker.id] = [row, square]
                        checker.addEventListener('click', function (e) {
                            handleSelectPiece(e.target)
                        })
                        secondaryPieceCount += 1
                        checkersSquare.appendChild(checker)
                    }
                    break;
            }

            if (row % 2 == 0) {
                if (square % 2 == 0) {
                    checkersSquare.classList.add("primary-square-2")
                }
                else {
                    checkersSquare.classList.add("secondary-square-2")
                }
            }
            else {
                if (square % 2 == 0) {
                    checkersSquare.classList.add("secondary-square-2")
                }
                else {
                    checkersSquare.classList.add("primary-square-2")
                }
            }
            checkersRow.appendChild(checkersSquare)
        }
        checkersBoard.appendChild(checkersRow)
    }

    document.getElementById("page-content").insertAdjacentElement('beforeend', checkersBoard)

}

function handleSelectPiece(checkerDiv) {
    console.log(event.target)
}