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
var piecesState = {};
const initialBoard = {
    "primary-checker0": { x: 0, y: 2, king: false },
    "primary-checker1": { x: 2, y: 2, king: false },
    "primary-checker2": { x: 4, y: 2, king: false },
    "primary-checker3": { x: 6, y: 2, king: false },
    "primary-checker4": { x: 1, y: 1, king: false },
    "primary-checker5": { x: 3, y: 1, king: false },
    "primary-checker6": { x: 5, y: 1, king: false },
    "primary-checker7": { x: 7, y: 1, king: false },
    "primary-checker8": { x: 0, y: 0, king: false },
    "primary-checker9": { x: 2, y: 0, king: false },
    "primary-checker10": { x: 4, y: 0, king: false },
    "primary-checker11": { x: 6, y: 0, king: false },
    "secondary-checker0": { x: 1, y: 7, king: false },
    "secondary-checker1": { x: 3, y: 7, king: false },
    "secondary-checker2": { x: 5, y: 7, king: false },
    "secondary-checker3": { x: 7, y: 7, king: false },
    "secondary-checker4": { x: 0, y: 6, king: false },
    "secondary-checker5": { x: 2, y: 6, king: false },
    "secondary-checker6": { x: 4, y: 6, king: false },
    "secondary-checker7": { x: 6, y: 6, king: false },
    "secondary-checker8": { x: 1, y: 5, king: false },
    "secondary-checker9": { x: 3, y: 5, king: false },
    "secondary-checker10": { x: 5, y: 5, king: false },
    "secondary-checker11": { x: 7, y: 5, king: false },
}
// var currentTurn = 0
var gameMetaData = {
    "piecesState": piecesState,
    "currentTurn": 0
};
var primaryPieceCount = 0
var secondaryPieceCount = 0
var toggledTileIDS = []
var selectedPieceID = null;
var lockedSelectedPieceID = null;
var possibleMoves = null;
var initialTimeSeconds = 309
var primaryStopwatchTime = initialTimeSeconds;
var secondaryStopwatchTime = initialTimeSeconds;
var gameInitializerFormContainer;
var playerName;
var gameroomName;

// Firebase
var checkersCollection;
var gameroomDoc;


setupSpecificPage = function () {
    console.log("Setting up Checkers.html")
    firebase.initializeApp(firebaseConfig);
    checkersCollection = firebase.firestore().collection("checkers")
    gameInitializerContainer = document.getElementsByClassName("game-initiation-button-container")[0]
    gameInitializerFormContainer = document.getElementsByClassName("game-initiation-form-container")[0]
    // handleCreateNewGame()
}

async function handleCreateNewGame() {

    playerName = gameInitializerFormContainer.children[0].value
    gameroomName = gameInitializerFormContainer.children[1].value
    let gameRoomNameOK = false;

    if (playerName == "") {
        console.warn("You need a player name!")
        shakeElement(gameInitializerFormContainer.children[0])
        return
    }
    else if (gameroomName == "") {
        console.warn("You need a gameroom name!")
        shakeElement(gameInitializerFormContainer.children[1])
        return
    }
    gameMetaData["primaryPlayer"] = playerName
    gameMetaData["currentTurn"] = 0;


    await checkersCollection.doc(gameroomName).get().then(function (doc) {
        if (!doc.exists) {
            gameRoomNameOK = true;
        }
    })

    if (!gameRoomNameOK) {
        console.error("Tried to make a game-room for a name that already exists")
        shakeElement(gameInitializerFormContainer.children[1])
        return
    }

    gameInitializerContainer.style.display = "none"
    gameroomDoc = checkersCollection.doc(gameroomName)
    drawCheckersBoard()
    setupStopWatches()
    monitorGame()
    checkersCollection.doc(gameroomName).set(gameMetaData)
}

async function handleJoinGame() {
    playerName = gameInitializerFormContainer.children[0].value
    gameroomName = gameInitializerFormContainer.children[1].value
    gameroomDoc = checkersCollection.doc(gameroomName)
    if (playerName == "") {
        console.warn("You need a player name!")
        shakeElement(gameInitializerFormContainer.children[0])
        return
    }
    else if (gameroomName == "") {
        console.warn("You need a gameroom name!")
        shakeElement(gameInitializerFormContainer.children[1])
        return
    }





    await gameroomDoc.get().then(function (doc) {
        if (doc.exists) {
            gameMetaData = doc.data()
            if (gameMetaData.hasOwnProperty("secondaryPlayer") && gameMetaData["secondaryPlayer"] != playerName) {
                console.error("This gameroom already has two players, and you aren't one of them!")
                return
            }

            if (playerName != gameMetaData["primaryPlayer"]) {
                gameMetaData["secondaryPlayer"] = playerName
                console.log("Updating secondary player in firebase")
                gameroomDoc.update({ "secondaryPlayer": playerName })
            }


            // console.log(gameMetaData)
            gameInitializerContainer.style.display = "none"
            drawCheckersBoard(false)
            monitorGame()
        } else {
            // doc.data() will be undefined in this case
            shakeElement(gameInitializerFormContainer.children[1])
            console.warn("No such gameroom exists!");
            return


        }
    })




}


function drawCheckersBoard(isNewGame = true) {
    const checkersGameContainerElement = document.getElementById("checkers-game-container")


    var checkersBoard = document.createElement('div')
    checkersBoard.classList.add("checkers-board")

    /*html */
    infoContainerElementString = `<div id="secondary-player-info" class="checkers-game-player-info-container flex-column">
        <span class="player-stop-watch flex">
            <span>5</span>
            <span>:</span>
            <span>30</span>
        </span>
        <span class="pieces-captured-container">
            <span>Pieces Captured</span>
            <span>0</span>
        </span>
    </div>
    <div class="game-info-player-turn-container flex">
        <div class="checker primary-checker"></div>
    </div>
    <div id="checkers-board-container">
    </div>
    <div id="primary-player-info" class="checkers-game-player-info-container flex-column">
        <span>${playerName}</span>
        <span class="player-stop-watch flex">
            <span>5</span>
            <span>:</span>
            <span>30</span>
        </span>
        <span class="pieces-captured-container">
            <span>Pieces Captured</span>
            <span>0</span>
        </span>
    </div>`

    checkersGameContainerElement.insertAdjacentHTML('afterbegin', infoContainerElementString)



    for (let row = 0; row < 8; row++) {
        var checkersRow = document.createElement('div')
        checkersRow.classList.add("checkers-row")
        for (let square = 0; square < 8; square++) {
            var checkersSquare = isNewGame ? createCheckerSquare(square, 7 - row) : createCheckerSquare(7 - square, row)
            checkersRow.appendChild(checkersSquare)
        }
        checkersBoard.appendChild(checkersRow)
    }

    document.getElementById('checkers-board-container').insertAdjacentElement('afterbegin', checkersBoard)


    for (const pieceID in initialBoard) {
        if (initialBoard.hasOwnProperty(pieceID)) {
            const piece = initialBoard[pieceID];
            isPrimary = pieceID.substring(0, 7) == "primary"
            squareElementForPiece = document.getElementById(`checkers-square-${piece["x"]}-${piece["y"]}`)
            // console.log("placing piece: ", pieceID, " at: ")
            // console.log(`checkers-square-${piece["x"]}-${piece["y"]}`)
            // console.log(squareElementForPiece)
            createChecker(isPrimary, squareElementForPiece, piece.x, piece.y)
        }
    }



}

function handleSelectPiece() {
    // console.log(event.target)
    checkerID = event.target.id
    checkerPosition = piecesState[checkerID]

    if (gameMetaData["secondaryPlayer"] == null) {
        console.error("Dont try to start before your opponent joins...")
        return
    }

    currentTurnSide = checkerID.substring(0, 7) == "primary" ? 0 : 1


    if (currentTurnSide != gameMetaData["currentTurn"]) {
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
        if (checkerID != selectedPieceID && lockedSelectedPieceID == null) {
            console.warn("Selected piece that wasn't currently selected")
            possibleMoves.forEach(coord => {
                toggleTileHighlight(coord)
            })
            selectedPieceID = checkerID
            possibleMoves = genPossibleMoves(checkerPosition)
            possibleMoves.forEach(coord => {
                toggleTileHighlight(coord)
            })
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
    // console.log("generating possible moves for position: ", checkerData)
    pieceID = pieceIDAtPosition([checkerData["x"], checkerData["y"]])
    result = []
    targetPositions = [
        [checkerData["x"] - 1, checkerData["y"] - 1],
        [checkerData["x"] + 1, checkerData["y"] - 1],
        [checkerData["x"] - 1, checkerData["y"] + 1],
        [checkerData["x"] + 1, checkerData["y"] + 1],
    ]
    // console.log(targetPositions)


    targetPositions.forEach(potentialTarget => {
        if (!isValidCoordinate(potentialTarget)) {
            return;
        }


        pieceIDAtTargetPosition = pieceIDAtPosition(potentialTarget)

        // console.log(`Checking position (${potentialTarget[0]},${potentialTarget[1]})`)
        if (pieceIDAtTargetPosition == null) {
            if (gameMetaData["currentTurn"] == 0 && potentialTarget[1] > checkerData["y"] || gameMetaData["currentTurn"] == 1 && potentialTarget[1] < checkerData["y"] || lockedSelectedPieceID != null) {
                result.push(potentialTarget)
            }
        }
        if (pieceIDAtTargetPosition != null) {
            pieceIDAtTargetPositionSide = pieceIDAtTargetPosition.substring(0, 7) == "primary" ? 0 : 1

            if (pieceIDAtTargetPositionSide != gameMetaData["currentTurn"]) {
                // Can skip over 'eat' oponent
                const eatOpponentPieceCoord = [checkerData["x"] + (2 * (potentialTarget[0] - checkerData["x"])),
                checkerData["y"] + (2 * (potentialTarget[1] - checkerData["y"]))]
                pieceAtEatOpponentPieceCoord = pieceIDAtPosition(eatOpponentPieceCoord)
                if (isValidCoordinate(eatOpponentPieceCoord) && pieceAtEatOpponentPieceCoord == null) {
                    // console.log("Can eat opponent and land on: ", eatOpponentPieceCoord)
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
    // for (const piece in piecesState) {
    //     if (piecesState.hasOwnProperty(piece)) {
    //         const pieceData = piecesState[piece];
    //         // console.log(pieceCoord)
    //         if (pieceData != null && pieceData.x == targetCoord[0] && pieceData.y == targetCoord[1]) {
    //             return piece
    //         }
    //     }
    // }
    tile = document.getElementById(`checkers-square-${targetCoord[0]}-${targetCoord[1]}`)
    // console.log("checking tile: ", tile)
    if (tile.childElementCount != 1) {
        return null
    }
    else {
        return tile.children[0].id
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
        "king": false,
        "x": x,
        "y": y,
    }
    // console.log((isPrimary && gameMetaData["primaryPlayer"] == playerName))
    // console.log(!isPrimary && gameMetaData["secondaryPlayer"] == playerName)

    if (isPrimary) {
        // console.log("Making primary checker")
        if (gameMetaData["primaryPlayer"] == playerName) {
            // console.log("Adding event listener for board ", playerName, "to :", checker.id)
            checker.addEventListener('click', function (e) {
                handleSelectPiece(e.target)
            })
        }
    }
    if (!isPrimary) {
        // console.log("Making secondary checker")
        // console.log(gameMetaData["secondaryPlayer"])
        if (gameMetaData["secondaryPlayer"] == playerName) {
            // console.log("Adding event listener for board ", playerName, "to :", checker.id)
            checker.addEventListener('click', function (e) {
                handleSelectPiece(e.target)
            })
        }
    }

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
    console.log(`Moving ${selectedPieceID} from ${piecesState[selectedPieceID]["x"]},${piecesState[selectedPieceID]["y"]}  to ${destinationTileCoord[0]},${destinationTileCoord[1]}`)
    piecesState[selectedPieceID]["x"] = destinationTileCoord[0]
    piecesState[selectedPieceID]["y"] = destinationTileCoord[1]




    const update = {}
    update[`piecesState.${selectedPieceID}`] = piecesState[selectedPieceID]

    // const update = {};. Then set update fields like this update[`favorites.${someUid}`] = 'abc'; and update the collection db.collection("users").doc("frank").update(update)

    if (eatOpponentMove) {
        // console.log(`Current Position ${selectedPieceCoord} , target Position: ${destinationTileCoord} , eat Position: ${eatenPieceCoord}`)

        removePieceAtPosition(eatenPieceCoord)
        lockedSelectedPieceID = selectedPieceID;

        possibleMoves = genPossibleMoves({
            "x": destinationTileCoord[0],
            "y": destinationTileCoord[1],
            "king": selectedPieceData["king"]
        })
        // console.log("Retoggling after an eat move: ", possibleMoves)
        possibleMoves.forEach(coord => {
            toggleTileHighlight(coord)
        })

        infoContainerID = gameMetaData["currentTurn"] == 0 ? "primary-player-info" : "secondary-player-info"
        document.getElementById(infoContainerID).getElementsByClassName("pieces-captured-container")[0].children[1].innerText = parseInt(document.getElementById(infoContainerID).getElementsByClassName("pieces-captured-container")[0].children[1].innerText) + 1
    }
    else {
        // console.log("Changing turn")
        handleChangeTurn()
    }
    update["currentTurn"] = gameMetaData["currentTurn"]
    console.log("This is the update being sent")
    console.log(update)
    gameroomDoc.update(update)


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

function removePieceAtPosition(coord, publishToDB = true) {
    eatenPieceID = pieceIDAtPosition(coord)
    piecesState[eatenPieceID] = null
    eatenPiece = document.getElementById(eatenPieceID)
    console.log(`Eating pieceID: ${eatenPieceID} element: `)
    console.log(eatenPiece)
    console.log(`Removing piece: ${eatenPieceID} at ${coord}`)

    if (publishToDB) {
        deletePieceUpdate = {}
        deletePieceUpdate[`piecesState.${eatenPieceID}`] = null
        gameroomDoc.update(deletePieceUpdate)
    }
    eatenPiece.remove()
}

function handleChangeTurn() {
    console.error("Turn has changed")
    const prevTurnString = (gameMetaData["currentTurn"] == 0) ? "primary" : "secondary"
    gameMetaData["currentTurn"] = (gameMetaData["currentTurn"] + 1) % 2
    const currentTurnString = (gameMetaData["currentTurn"] == 0) ? "primary" : "secondary"
    turnInfoChecker = document.getElementsByClassName("game-info-player-turn-container")[0].children[0]
    turnInfoChecker.classList.remove(prevTurnString + "-checker")
    turnInfoChecker.classList.add(currentTurnString + "-checker")
    lockedSelectedPieceID = null;
    selectedPieceID = null;
    possibleMoves = null;
}

function updateStockWatch() {
    // console.log("Updating stop-watch")
    const currentPlayer = gameMetaData["currentTurn"] == 0 ? "primary" : "secondary"
    let minutes;
    let secs;
    if (gameMetaData["currentTurn"] == 0) {
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

    // console.log(`stopwatch P: ${primaryStopwatchTime}, stopwatch S: ${secondaryStopwatchTime}`)

    primaryStopwatch.children[0].innerText = primaryMinutes
    primaryStopwatch.children[2].innerText = primarySeconds < 10 ? "0" + primarySeconds : primarySeconds;

    secondaryStopwatch.children[0].innerText = secondaryMinutes;
    secondaryStopwatch.children[2].innerText = secondarySeconds < 10 ? "0" + secondarySeconds : secondarySeconds;
}

async function deleteAllStoredGames() {
    await checkersCollection.get()
        .then(querySnapshot => {
            querySnapshot.docs.forEach(doc => {
                checkersCollection.doc(doc.id).delete()
            });
            console.log("Deleted all games...")
        })
}

function monitorGame() {
    gameroomDoc.onSnapshot(function (doc) {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        // console.log(`Change came from ${source}`)
        // console.log(`1: ${gameMetaData["currentTurn"]}`)
        if (doc.data() == undefined) {
            console.error("Listened to firebase doc change that doesn't exist?!")
            return;
        }

        switch (source) {
            case "Local":
                break;
            case "Server":
                // console.log("New Game Data")
                // console.log(doc.data())
                // console.log(`2: ${currentTurn}`)
                handleOpponentUpdate(doc.data())
                break;
        }
    });
}

function handleOpponentUpdate(newGameState) {
    // console.log(gameMetaData["currentTurn"])
    // console.log(newGameState)
    if (newGameState["secondaryPlayer"] != gameMetaData["secondaryPlayer"]) {
        gameMetaData["secondaryPlayer"] = newGameState["secondaryPlayer"]
        console.warn("Second player joined the game")
    }
    else if (newGameState["currentTurn"] != gameMetaData["currentTurn"]) {
        // console.warn("Detected change in turn")
        handleChangeTurn()
    }
    for (const pieceID in newGameState["piecesState"]) {
        if (newGameState["piecesState"].hasOwnProperty(pieceID)) {
            isCurrentPlayerPiece = (pieceID.substring(0, 7) == "primary") && (gameMetaData["p1"] == playerName)
            if (newGameState["piecesState"][pieceID] == null && gameMetaData["piecesState"][pieceID] == null) {
                continue
            }
            else if (newGameState["piecesState"][pieceID] == null && gameMetaData["piecesState"][pieceID] != null && isCurrentPlayerPiece) {
                console.warn("Opponent has eaten one of your pieces")
                removePieceAtPosition([gameMetaData["piecesState"][pieceID]["x"], gameMetaData["piecesState"][pieceID]["y"]], false)
                // gameMetaData["piecesState"][pieceID] = null
            }
            else if (pieceStateDifferent(newGameState["piecesState"][pieceID], gameMetaData["piecesState"][pieceID])) {
                console.log("Detected change in piece: ", pieceID)
                console.log(gameMetaData["piecesState"][pieceID])
                console.log(newGameState["piecesState"][pieceID])
                gameMetaData["piecesState"][pieceID] = newGameState["piecesState"][pieceID]
                updatePieceLocation(pieceID)
            }
        }
    }
}

function pieceStateDifferent(piece1, piece2) {
    if (piece1 == null || piece2 == null) {
        return true
    }
    if (piece1["x"] != piece2["x"]) {
        return true
    }
    if (piece1["y"] != piece2["y"]) {
        return true
    }
    if (piece1["king"] != piece2["king"]) {
        return true
    }
    return false
}

function updatePieceLocation(pieceID) {
    const pieceElement = document.getElementById(pieceID)
    if (gameMetaData["piecesState"][pieceID] == null) {
        pieceElement.remove()
        return
    }
    destinationTile = document.getElementById(`checkers-square-${gameMetaData["piecesState"][pieceID]["x"]}-${gameMetaData["piecesState"][pieceID]["y"]}`)
    // console.log("Destination tile element:")
    // console.log(destinationTile)
    destinationTile.insertAdjacentElement('afterbegin', pieceElement)
}

function printState() {
    console.table(gameMetaData["piecesState"])
}