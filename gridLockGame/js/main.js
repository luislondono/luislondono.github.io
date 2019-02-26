window.onload = setupWindow
var gameSeconds;
var timer;
var moves = 0;
var movesLabel;
var currentLevel = 1;
setInterval(updateTimer,1000);
// setInterval(checkLevelComplete,100);

levelComplete = false;
displayCompletionLabel = false;
levelCompleteTimer = 0;

document.onkeydown = checkLevelComplete

allCars = {
    "redCar"        : {"color" : [255,59,59]    , "length" : 2, isVertical : false } ,
    "greenCar"      : {"color" : [255,59,59]    , "length" : 2, isVertical : null } ,
    "lightGreenCar" : {"color" : [136,212,131]  , "length" : 2, isVertical : null } ,
    "oliveCar"      : {"color" : [255,59,59]    , "length" : 2, isVertical : null } ,
    "lightBlueCar"  : {"color" : [205,229,241]    , "length" : 2, isVertical : null } ,
    "brownCar"      : {"color" : [255,59,59]    , "length" : 2, isVertical : null } ,
    "yellowCar"     : {"color" : [255,59,59]    , "length" : 2, isVertical : null } ,
    "orangeCar"     : {"color" : [240,181,83]    , "length" : 2, isVertical : null } ,
    "pinkCar"       : {"color" : [255,59,59]    , "length" : 2, isVertical : null } ,
    "grayCar"       : {"color" : [255,59,59]    , "length" : 2, isVertical : null } ,
    "beigeCar"      : {"color" : [255,59,59]    , "length" : 2, isVertical : null },
    "purpleCar"     : {"color" : [255,59,59]    , "length" : 2, isVertical : null } ,
    "blueTruck"     : {"color" : [71,157,255]    , "length" : 3, isVertical : null } ,
    "greenTruck"    : {"color" : [98, 172, 181]   , "length" : 3, isVertical : null } ,
    "purpleTruck"   : {"color" : [211,169,220]  , "length" : 3, isVertical : null } ,
    "yellowTruck"   : {"color" : [248, 227, 71]    , "length" : 3, isVertical : null } 
}

function boardPiece(name, length, isVertical, intXpos, intYpos,[r,g,b]){
    this.name = name
    this.intXpos = intXpos
    this.intYpos = intYpos
    this.pLotX = grassPadding + lotPadding +  intXpos * squareSize + squarePadding;
    this.pLotY = grassPadding + lotPadding +  intYpos * squareSize+ squarePadding;
    this.red = r
    this.green = g
    this.blue = b
    this.isVertical = isVertical
    this.length = length
    this.height = isVertical? length * squareSize - 2 * squarePadding: 1 * squareSize - 2 * squarePadding;
    this.width = isVertical? 1 * squareSize - 2 * squarePadding: length * squareSize - 2 * squarePadding;
    this.needsUpdating = false;
    this.cachedX = intXpos;
    this.cachedY = intYpos;
    this.adjustNorthWest = null;
}

function checkLevelComplete(){
    console.log("Key was pressed, checking if level is complete")
    if(levelComplete){
        console.log("Level Done, waiting to load next map")
        currentLevel += 1;
        setupBoard(currentLevel,false);
        updateLevelLabel();
    }
}

function updateTimer(){
    // console.log("updateTimer being called")
    gameSeconds += 1;
    timer.innerText = formatTime(gameSeconds);
}

function formatTime(seconds){
    hours = (gameSeconds >= 3600)? String((gameSeconds - gameSeconds%3600)/3600) + ":" : ""
    min = String( (seconds%3600 - seconds%60) / 60) + ":";
    sec = String(seconds%60);

    if (min.length < 3){
        min = "0" + min
    }
    if (sec.length < 2){
        sec = "0" + sec
    }
    if ((hours != "") && (hours.length <3)){
        hours = "0" + hours
    }
    // console.log(min + ":" + sec);
    return hours + min + sec;
}

function setupWindow(){
    setupBoard()


    gameSeconds = 0;
    timer = document.getElementById('game-timer');
    movesLabel = document.getElementById('moves-count');
    console.log("Setup the Window")

    
}

function setupBoard(level = 1, initial = true){
    clearBoard(initial)
    console.log("Setting up the Board for level: " + level)
    for (var piece in maps[level]) {
        // console.log(piece)
        cars.push(piece)
        pieces[piece] = new boardPiece(
            piece,
            allCars[piece]["length"],
            maps[level][piece][1],
            maps[level][piece][0][0],
            maps[level][piece][0][1],
            allCars[piece]["color"]);
    }
    loop()
    // console.log(cars)
}

function updateMoves(){
    movesLabel.innerText = String(moves)
}

function updateLevelLabel(){
    document.getElementById('level-label').innerText = "Level " + currentLevel;
}

function clearBoard(initial = false){
    cars= []
    pieces = {}
    moves = 0;
    gameSeconds = 0;
    levelComplete = false;
    displayCompletionLabel = false;
    levelCompleteTimer = 0;
    if (!initial){
        updateMoves();
    }
}


maps = {
    1:{
        "redCar"        :[[1,2],false],
        "lightGreenCar" :[[0,0],false],
        "purpleTruck"   :[[0,1],true],
        "orangeCar"     :[[0,4],true],
        "blueTruck"     :[[3,1],true],
        "yellowTruck"   :[[5,0],true],
        "lightBlueCar"  :[[4,4],false],
        "greenTruck"    :[[2,5],false]
    },
    2:{
        "redCar"        :[[0,2],false],
        "lightGreenCar" :[[0,0],true],
        "purpleTruck"   :[[5,1],true],
        "orangeCar"     :[[3,1],true],
        "blueTruck"     :[[0,3],false],
        "yellowTruck"   :[[3,0],false],
        "lightBlueCar"  :[[4,2],true],
        "greenCar"      :[[0,5],false],
        "pinkCar"       :[[2,4],true],
        "purpleCar"     :[[4,4],false],
        "grayCar"       :[[3,5],false],
    }
}


