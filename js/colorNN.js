var firebaseConfig = {
    apiKey: "AIzaSyCSFoOcUMAULAn6ScMSgygfS_fZcnVTpSk",
    authDomain: "luislondono-com.firebaseapp.com",
    databaseURL: "https://luislondono-com.firebaseio.com",
    projectId: "luislondono-com",
    storageBucket: "luislondono-com.appspot.com",
    messagingSenderId: "851373763529",
    appId: "1:851373763529:web:c171fe15b7d82883"
};

var ColorSelectorCollection;
var dbLabeledData;
var textColor = [null, null, null]
var backgroundColor = [null, null, null]

// Class Definitions
class Node {
    constructor(inputNodes, outputNode) {
        this.inputNodes = inputNodes
        this.outputNode = outputNode
        this.input = 0;
        this.value = 0;
    }

    addInputNode(node) {
        this.inputNodes = node
    }
    setOutputNode(node) {
        this.outputNode = node
        node.addInputNode(this)
    }
}

class Layer {
    constructor(numNodes) {
        this.nodes = []
        for (let index = 0; index < numNodes; index++) {
            this.nodes.push(new Node())
        }
    }
}

class NN {
    constructor(numNodesByLayer, weights, activationFunction) {
        this.layers = []
        for (let layerIndex = 0; layerIndex < numNodesByLayer.length; layerIndex++) {
            this.layers.push(
                new Layer(numNodesByLayer[layerIndex])
            )
        }
    }

}

function setupNN() {
    afunc = logistic
    result = new NN([6, 3, 2, 1], [], afunc)

    result.layers[0].nodes[0].setOutputNode(result.layers[1].nodes[0])
    result.layers[0].nodes[1].setOutputNode(result.layers[1].nodes[1])
    result.layers[0].nodes[2].setOutputNode(result.layers[1].nodes[2])
    result.layers[0].nodes[3].setOutputNode(result.layers[1].nodes[0])
    result.layers[0].nodes[4].setOutputNode(result.layers[1].nodes[1])
    result.layers[0].nodes[5].setOutputNode(result.layers[1].nodes[2])

    result.layers[1].nodes[0].setOutputNode(result.layers[2].nodes[0])
    result.layers[1].nodes[1].setOutputNode(result.layers[2].nodes[0])
    result.layers[1].nodes[1].setOutputNode(result.layers[2].nodes[0])
    result.layers[1].nodes[2].setOutputNode(result.layers[2].nodes[1])

    result.layers[2].nodes[0].setOutputNode(result.layers[3].nodes[0])
    result.layers[2].nodes[1].setOutputNode(result.layers[3].nodes[0])

    return result
}

function displayNN(neuralNetwork) {
    for (let layerIndex = 0; layerIndex < neuralNetwork.layers.length; layerIndex++) {
        const layer = neuralNetwork.layers[layerIndex];

        var layerElement = document.createElement('div')
        layerElement.classList.add("neural-layer")

        for (let nodeIndex = 0; nodeIndex < layer.nodes.length; nodeIndex++) {
            const node = layer.nodes[nodeIndex];
            var nodeElement = document.createElement('div')
            nodeElement.classList.add("node")
            nodeValueLabelElement = document.createElement('div')
            nodeValueLabelElement.classList.add("node-value-label")
            nodeElement.id = `${layerIndex}-${nodeIndex}`
            nodeValueLabelElement.innerText = node.value
            nodeElement.appendChild(nodeValueLabelElement)
            layerElement.appendChild(nodeElement)
        }
        connectionElement = null;
        if (layerIndex != neuralNetwork.layers.length - 1) {
            connectionElement = document.createElement('svg')
            connectionElement.classList.add('connection-element')
            lineElement = document.createElement('line')
            lineElement.id = "line_0-0--1-0"
            connectionElement.appendChild(lineElement)

        }

        document.getElementById("neural-network-diagram-container").appendChild(layerElement)
        document.getElementById("neural-network-diagram-container").appendChild(connectionElement)

    }

    linesSVG = document.createElement('svg')
    linesSVG.style
    line = document.createElement('line')
    line.x1 = "475"
    line.x2 = "548"
    line.y1 = "167"
    line.y2 = "202"

    linesSVG.appendChild(line)
    document.getElementById("neural-network-diagram-container").appendChild(linesSVG)

}



var logistic = function (x, L = 1, k = 1) {
    return (L / (1 + Math.exp(-k * x)))
}



//

function handleClickedColor() {
    const colorInput = document.getElementById("color-picker")
    console.log(colorInput.value)
}

function setupSpecificPage() {
    console.log("Setting up Color Selector NN")
    firebase.initializeApp(firebaseConfig);

    ColorSelectorCollection = firebase.firestore().collection("colorSelectorNN")
    dbLabeledData = ColorSelectorCollection.doc("labeledData")
    randomizeColors()

    displayNN(setupNN())

}

async function printLabeledData() {
    await ColorSelectorCollection.doc("labeledData").get().then(doc => {
        console.log(JSON.parse(doc.data()))
    })
}

function randomizeTextColor() {
    textColor = [Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255)]
    document.getElementsByClassName("color-selector-sample-text")[0].style.color = `rgb(${textColor[0]},${textColor[1]},${textColor[2]})`
}
function randomizeBackgroundColor() {
    backgroundColor = [Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255)]
    document.getElementsByClassName("color-selector-sample-text-wrapper")[0].style.backgroundColor = `rgb(${backgroundColor[0]},${backgroundColor[1]},${backgroundColor[2]})`
}

function randomizeColors() {
    randomizeTextColor()
    randomizeBackgroundColor()
}

function labelGood() {
    console.log("Labeling good:")
    console.table({
        "textColor": textColor,
        "backgroundColor": backgroundColor,
        "legible": 0
    })
    dbLabeledData.collection("legible").doc().set(
        {
            "textColor": textColor,
            "backgroundColor": backgroundColor,
            "legible": 1
        }
    )
    randomizeColors()
}

function labelBad() {
    console.log("Labeling bad:")
    console.table({
        "textColor": textColor,
        "backgroundColor": backgroundColor,
        "legible": 0
    })
    dbLabeledData.collection("illegible").doc().set(
        {
            "textColor": textColor,
            "backgroundColor": backgroundColor,
            "legible": 0
        }
    )
    randomizeColors()
}
