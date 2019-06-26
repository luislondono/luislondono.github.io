var firebaseConfig = {
    apiKey: "AIzaSyCSFoOcUMAULAn6ScMSgygfS_fZcnVTpSk",
    authDomain: "luislondono-com.firebaseapp.com",
    databaseURL: "https://luislondono-com.firebaseio.com",
    projectId: "luislondono-com",
    storageBucket: "luislondono-com.appspot.com",
    messagingSenderId: "851373763529",
    appId: "1:851373763529:web:c171fe15b7d82883"
};

const useGoogleAuth = false;
const devMode = true;
// var provider;
var userEmail;
var userDocument;
var portfolioCollection;
var stockSearchBarInputElement;
var searchResultsContainerElement;
var searchBarTimeout = null;
var cachedQuery = null;
var cachedLastSearchResultHTML = null
var displayResultsContainer = false;
var apiKeyCounter = 0;
var modalActive = false;
var sellingSecurity = null;
var quandlKey = 'xXj3VxSfn6yF5ghJpgTF'






async function setupSpecificPage() {
    const pageName = window.location.pathname.split("/").pop()
    console.log("Setting up: ", pageName)
    firebase.initializeApp(firebaseConfig);
    portfolioCollection = firebase.firestore().collection("portfolioCollection")

    var provider = new firebase.auth.GoogleAuthProvider();
    // provider.addScope('profile');
    // provider.addScope('https://www.googleapis.com/auth/drive');
    firebase.auth().useDeviceLanguage()

    if(useGoogleAuth){

        firebase.auth().signInWithPopup(provider).then(async function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            userEmail = user.email
            console.log(user)
            
            userDocument = await fetchPortfolio(userEmail)
            updatePortfolioHTML()
            
            // ...
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    }
        
    // firebase.auth().onAuthStateChanged(function (user) {
    //     if (user) {
    //         console.log("Signed in !")
    //     }
    // })

    // firebase.auth().signInWithRedirect(provider);

    // firebase.auth().getRedirectResult().then(function (result) {
    //     if (result.credential) {
    //         // This gives you a Google Access Token. You can use it to access the Google API.
    //         var token = result.credential.accessToken;
    //         console.log(token)
    //         // ...
    //     }
    //     // The signed-in user info.
    //     var user = result.user;
    // }).catch(function (error) {
    //     // Handle Errors here.
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     // The email of the user's account used.
    //     var email = error.email;
    //     // The firebase.auth.AuthCredential type that was used.
    //     var credential = error.credential;
    //     // ...
    // });

    stockSearchBarInputElement = document.getElementById('stock-search-bar')
    searchResultsContainerElement = document.getElementsByClassName("search-results-container")[0];
    // stockSearchBarInputElement.onkeyup = function (e) {
    //     searchBarTimeout = setTimeout(function () {
    //         executeStockSearchQuery()
    //     }, 100);
    // }
    stockSearchBarInputElement.onkeydown = function (e) {
        const code = e.keyCode ? e.keyCode : e.which
        if (code == 13) {
            console.log("Pressed search:")
            executeStockSearchQuery()
        }
    }


    document.getElementById("page-content").onclick = function (e) {
        // console.log(e.target)
        if (document.getElementById('stock-search-container').contains(e.target)) {
            // Clicked in box
            if (displayResultsContainer != true || stockSearchBarInputElement === document.activeElement) {
                displayResultsContainer = true
                // console.log("Clicked in search container")
                if (stockSearchBarInputElement.value != '' && stockSearchBarInputElement.value == cachedQuery) {
                    // console.log("Pulling results from cache")
                    searchResultsContainerElement.id = "";
                    document.getElementsByClassName("stock-search-bar-container")[0].id = "stock-search-bar-container-with-results"
                    searchResultsContainerElement.innerHTML = cachedLastSearchResultHTML
                    // executeStockSearchQuery()
                }
            }
        }
        else {
            // console.log("Clicked outside search container")
            escapeSearchField()
        }
    }


    if (userDocument === undefined) {
        userDocument = {
            "historicalPortfolioValue": {},
            "latestPortfolio": {
                "Cash": 1000
            }
        }
        userEmail = "luislondono.acct@gmail.com"
    }

    // document.getElementById("page-title").children[1].innerText = userEmail
    document.getElementById("page-title").insertAdjacentHTML("afterend", `<h3 id = "client-name-title" >${userEmail}</h3 >`)





    if(devMode){
        // Do whatever you want to develop
        userDocument = {
            "historicalPortfolioValue": {},
            "latestPortfolio": {
                "Cash": 1000,
                "AAPL":{
                    "companyName":"Apple",
                    "averageCost":200,
                    "lastPrice":195.64,
                    "shares":12,
                    "totalReturn":-52.32
                }
            }
        }
        userDocument = {"historicalPortfolioValue":{},"latestPortfolio":{"Cash":1000,"AAPL":{"companyName":"Apple","averageCost":200,"lastPrice":195.64,"shares":12,"totalReturn":-52.32}}}
        updatePortfolioHTML()
        generateAddSecurityModal('Apple', 'AAPL')

    }

}

function escapeSearchField() {
    displayResultsContainer = false
    searchResultsContainerElement.innerHTML = ''
    searchResultsContainerElement.id = "search-results-container-empty"
    document.getElementsByClassName("stock-search-bar-container")[0].id = id = "stock-search-bar-container-no-results"
}

function constructEndpoint(request) {
    var result = "https://www.alphavantage.co/query?function=" + request["function"]
    const keylist = ["PZIWIUXBWSES0VO4", "U8NEQ8ZGZP25R6Z5", "NYB2UDXDHZITQ0FZ", "8U6YN0U5W56PA5XE", "SWUDD4PY4SEAT2O5", "79M6713ACXHE2VDO", "OH9P2JW957VDNLVA", "C1ZFP9AWTABCF1Z4"]
    const key = keylist[apiKeyCounter % keylist.length]
    // console.log("Using key: ", key)
    apiKeyCounter += 1


    if (request["function"] == "GLOBAL_QUOTE") {
        // console.log("Getting a global_quote")
        result += "&symbol=" + request["symbol"] + "&apikey=" + key
    }
    else if (request["function"] == "SYMBOL_SEARCH") {
        result += "&keywords=" + request["keywords"] + "&apikey=" + key
    }
    // console.log(result)
    return result
}


function queryAlphaVantage(request, callback) {
    // var xmlHttp = new XMLHttpRequest();
    const url = constructEndpoint(request)
    console.log("Endpoint: ", url)
    fetch(url).then(function (response) {
        return response.json();
    }).then(function (json) {
        callback(json)
    })

}

function handleGetQuote() {
    req = {
        "function": "GLOBAL_QUOTE",
        "symbol": document.getElementById("symbol-field").value
    }
    queryAlphaVantage(req, function (json) {
        document.getElementById("quote-response").innerText = JSON.stringify(json)
    }
    )
}



async function fetchPortfolio(email) {
    result = await portfolioCollection.doc(email).get().then(function (doc) {
        if (doc.exists) {
            // console.log("Document data:", doc.data());
            return (doc.data())
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            return (null)
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
        return (null)
    });
    return result
}

function updatePortfolio(email, portfolio) {
    portfolioCollection.doc(email).update(portfolio)
        .then(function () {
            console.log("Document successfully updated!");
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}



function executeStockSearchQuery() {
    const query = stockSearchBarInputElement.value.trim()
    if (query != "" && query != cachedQuery) {
        console.log("Continuing with requested query: ", query)
        const req = {
            "function": "SYMBOL_SEARCH",
            "keywords": query
        }
        // const symbolLookupEndpoint = 'http://d.yimg.com/autoc.finance.yahoo.com/autoc?lang=en&query=' + query

        // fetch(symbolLookupEndpoint).then(function (response) {
        //     return response.json();
        // })


        queryAlphaVantage(req, function (result) {
            console.log(result)

            if (!("bestMatches" in result)) {
                console.log("Overloaded API, try again later")
            }
            else {
                // console.log(result.bestMatches)
                cachedQuery = query
                if (result.bestMatches != undefined && result.bestMatches.length != 0) {
                    // console.log("Processing non-trivial results!")
                    resultHTMLAccumulator = ""
                    result.bestMatches.forEach(match => resultHTMLAccumulator += constructSearchMatchResultHTML(match))
                    if (resultHTMLAccumulator == "") {
                        resultHTMLAccumulator = constructNoMatchResultsHTML()
                    }
                    cachedLastSearchResultHTML = resultHTMLAccumulator

                    if (displayResultsContainer || stockSearchBarInputElement === document.activeElement) {
                        searchResultsContainerElement.innerHTML = resultHTMLAccumulator
                        document.getElementsByClassName("stock-search-bar-container")[0].id = "stock-search-bar-container-with-results"
                        searchResultsContainerElement.id = "search-results-container-with-results";

                    }

                }
                else {
                    document.getElementsByClassName("stock-search-bar-container")[0].id = "stock-search-bar-container-with-results"
                    searchResultsContainerElement.id = "search-results-container-with-results"
                    searchResultsContainerElement.innerHTML = constructNoMatchResultsHTML()
                    cachedLastSearchResultHTML = constructNoMatchResultsHTML()
                }
            }
        })
    }
    else if (query == "") {
        escapeSearchField()
    }

}

function constructNoMatchResultsHTML() {
    return '<div class="search-result"> <h4 id="search-result-null"></h4> No results found </div>'
}

function constructSearchMatchResultHTML(match) {
    if (match["4. region"] == "United States" && parseFloat(match["9. matchScore"]) > .5) {
        const ticker = match["1. symbol"].trim()
        const nameOffunction = `handleResultClick('` + ticker + `')`
        return '<div class="search-result" id="search-result-' + ticker + '" onclick =' + nameOffunction + '> <h4 class="search-result-symbol">' + ticker + '</h4> <h4 class="search-result-company-name">' + match["2. name"] + '</h4> </div>'
        // searchResultsContainerElement.insertAdjacentHTML("beforeend", resultElement)
    }
    return ""
}

function handleResultClick(symbol) {
    // console.log("You want to add ", symbol, " to your portfolio")
    const searchResult = document.getElementById("search-result-" + symbol)
    const companyName = searchResult.children[1].innerHTML
    generateAddSecurityModal(companyName, symbol)
}

function generatePortfolioPositionHTML(ticker) {
    // console.log(`Generating Portfolio Position HTML for ${ticker}`)
    var result;
    if (ticker == "Cash"){
        /*html*/
        result = `
        <div class="stock-container" id= "stock-container-${ticker}">
            <div class="company-info">
                <span>
                    <h4 class="company-info-name">Cash</h4>
                </span>
            </div>
            <div class="company-price-container">
                <h4>$${userDocument.latestPortfolio[ticker]}</h4>
            </div>
        </div>`
    }
    else{
        /*html*/
        result = `
        <div class="stock-container" id= "stock-container-${ticker}">
            <div class="company-info">
                <span>
                    <h4 class="company-info-name">${userDocument.latestPortfolio[ticker]["companyName"]}</h4>
                    <h4>
                        <h4 class="company-info-ticker">&nbsp;$${ticker}</h4>
                    </h4>
                </span>
                <h5 class="num-shares-label">${userDocument.latestPortfolio[ticker]["shares"]}&nbsp; ${ userDocument.latestPortfolio[ticker]["shares"] > 1 ? 'shares' : 'share' }</h5>
            </div>
            <div class="company-price-container">
                <h4>$${userDocument.latestPortfolio[ticker]["lastPrice"]}</h4>
            </div>
        </div>`
    }
    return result
}

function generateAddSecurityModal(companyName, ticker) {
    var existingPosition = ticker in userDocument.latestPortfolio;
    var numSharesInPortfolio = existingPosition? userDocument.latestPortfolio[ticker]["shares"] : 0
    
    var innerContainer;
    /*html*/
    const buySellButtons = `
        <div id= "buy-sell-button-container">
            <Button onclick = "handleTradeTypeButtonClick(false)" class = "trade-type-button" >Buy</Button>
            <Button onclick = "handleTradeTypeButtonClick(true)"class = "trade-type-button" id = "trade-type-button-active">Sell</Button>
        </div>
    `

    if (existingPosition) {
        sellingSecurity = true
        /*html*/
        innerContainer =
        `<div class="modal-content-edit-position-container">
        <div class="modal-content-edit-position-portfolio-details-container">
            <div class="modal-content-portfolio-info-labels"> 
                <h3 class="modal-content-number-shares">Current Position:</h3>
                <h3 class="modal-content-buy-price">Average Cost:</h3>
                <h3 class="modal-content-security-trading-price">Total Return: </h3>
            </div>
            <div class="modal-content-portfolio-info-inputs">
                <h3>${numSharesInPortfolio + (numSharesInPortfolio > 1 ? ' shares' : ' share')} </h3>
                <h3>&nbsp;&nbsp;$ 
                    <span>
                    ${userDocument.latestPortfolio[ticker].averageCost}
                    </span>
                </h3>
                <h3>${(userDocument.latestPortfolio[ticker].totalReturn < 0? '- ' :'')}$
                    <span>${Math.abs(userDocument.latestPortfolio[ticker].totalReturn)}</span>
                </h3>
            </div>
        </div>
        <div class="modal-content-edit-position-trade-container">
            <div class="modal-content-edit-position-trade-details-container">
                <div class="modal-content-edit-position-trade-info-labels">
                    <h3 class="modal-content-number-shares">Number of shares:</h3>
                    <h3 class="modal-content-execution-price">Sold at:</h3>
                    <h3 class="modal-content-security-trading-price">Current Price: </h3>
                </div>
                <div class="modal-content-trade-info-inputs">
                    <h3>&nbsp;&nbsp;&nbsp;<input type="text" value=" ${numSharesInPortfolio}"></h3>
                    <h3>$&nbsp;<input type="text"></h3>
                    <h3>$&nbsp;<span></span></h3>
                </div>
            </div>
            
        </div>`
        /*
        <div class="buy-sell-switch-container">
                <span class="slider-half">Bought</span>
                    <div class="buy-sell-switch-container-slider" id="bought-toggle">
                    <button onclick="handleBuySellSwitch()"></button>
                    </div>
                    <span class="slider-half">Sold</span> 
                    </div>
        </div>
        */
    }
    else {
        /*html*/
        innerContainer = `
            <div class="modal-content-initial-trade-info-container">
                <div class="modal-content-trade-info-labels">
                    <h3 class="modal-content-number-shares">Number of shares:</h3>
                    <h3 class="modal-content-buy-price">Purchased at:</h3>
                    <h3 class="modal-content-security-trading-price">Current Price: </h3>
                </div>
                <div class="modal-content-trade-info-inputs">
                    <h3>&nbsp;&nbsp;&nbsp;<input type="text" value=" ${numSharesInPortfolio}"></h3>
                    <h3>$&nbsp;<input type="text"></h3>
                    <h3>$&nbsp;<span>Loading...</span></h3>
                </div>
            </div>`
    }
    /*html*/
    var modal = `
        <div id="add-stock-from-search-modal" class="modal">
            <div class="modal-container">
                <button class="close" onclick="closeModal()">&times;</button>
                <div class="modal-content-securities">
                    <div class="modal-content-security-info">
                        <div class="modal-content-security-header">
                            <div class="modal-content-security-info-identifiers">
                            <h2>${companyName}<h3>$ ${ticker}</h3> </h2>
                            </div>
                            ${existingPosition? buySellButtons: ''}
                        </div>
                        <div class="modal-content-portfolio-editor-container">${innerContainer}</div>
                    </div>
                </div>
                <Button id="submit-to-portfolio-button">
                    ${existingPosition ? 'Update' : 'Add'}
                    <i class="material-icons right">send</i>
                </Button>
            </div>
        </div>`
    // console.log(element)
    document.getElementById("page-content").insertAdjacentHTML("afterend", modal)
    
    getStockQuote(ticker, (json)=>{
        if (json != undefined){
            currentPrice = parseFloat(json["delayedPrice"]).toFixed(2)
            document.getElementsByClassName("modal-content-trade-info-inputs")[0].children[2].children[0].innerText = currentPrice
            submitButton = document.getElementById("submit-to-portfolio-button")
            if(existingPosition){
                submitButton.addEventListener("click",function(){
                    handleEditSecurityInPortfolioFromModal(ticker)
                })
            }
            else{
                submitButton.addEventListener("click",function(){
                    handleAddSecurityToPortfolioFromModal(ticker,companyName)
                })
            }
            onclick=" ${existingPosition ? `handleEditSecurityInPortfolioFromModal('${ticker}')` : `handleAddSecurityToPortfolioFromModal('${ticker}','${companyName}','${}')`} "
        }
        else{
            document.getElementsByClassName("modal-content-trade-info-inputs")[0].children[2].innerText = "Not Found"
        }
    })

    setTimeout(() => { window.onclick = windowOnClickForActiveModal }, 10)

}


function closeModal() {
    document.getElementById("add-stock-from-search-modal").remove()
    window.onclick = null
}




function windowOnClickForActiveModal(event) {
    var modal = document.getElementById("add-stock-from-search-modal")
    if (!(modal === null)) {
        if (!modal.contains(event.target)) {
            console.log("Clicked out of modal")
            closeModal()
        }
    }
}

function handleAddSecurityToPortfolioFromModal(ticker,name,currentPrice,numShares,purchasePrice) {
    console.log("Executing handleaddsec")
    let averageCost;

    if (!(numShares === parseFloat(document.getElementsByClassName("modal-content-trade-info-inputs")[0].children[0].children[0].value)) || numShares <= 0) {
        document.getElementsByClassName("modal-container")[0].classList.add("invalid")
        // document.getElementsByClassName("modal-content-number-shares")[0].children[0].classList.add("invalid")
        setTimeout(() => {
            document.getElementsByClassName("modal-container")[0].classList.remove("invalid")
            // document.getElementsByClassName("modal-content-number-shares")[0].children[0].classList.remove("invalid")
        }, 750)
        return
    }
    const totalReturn = parseFloat(parseFloat((currentPrice - averageCost) * numShares).toFixed(2))

    userDocument.latestPortfolio[ticker] = {
        "companyName": companyName,
        "averageCost": averageCost,
        "lastPrice": currentPrice,
        "shares": numShares,
        "totalReturn": totalReturn,
    }
    updatePortfolioPositionHTML(ticker)
    escapeSearchField()
    closeModal()
}

function handleTradeTypeButtonClick(isSell) {
    if (isSell) {
        sellingSecurity = true
        document.getElementById("trade-type-button-active").id = ""
        document.getElementsByClassName("trade-type-button")[1].id = "trade-type-button-active"
        document.getElementsByClassName("modal-content-execution-price")[0].innerText = "Sold at:"
    }
    else {
        sellingSecurity = false
        document.getElementById("trade-type-button-active").id = ""
        document.getElementsByClassName("trade-type-button")[0].id = "trade-type-button-active"
        document.getElementsByClassName("modal-content-execution-price")[0].innerText = "Bought at:"
    }
}

function handleEditSecurityInPortfolioFromModal(ticker) {
    console.log("Submitting edit to security already in your portfolio")
    const numSharesTraded = parseFloat(document.getElementsByClassName("modal-content-trade-info-inputs")[0].children[0].children[0].value)
    const executionPrice = parseFloat(document.getElementsByClassName("modal-content-trade-info-inputs")[0].children[1].children[0].value)
    if(numSharesTraded <= 0 || executionPrice <= 0 ){
        document.getElementsByClassName("modal-container")[0].classList.add("invalid")
        // document.getElementsByClassName("modal-content-number-shares")[0].children[0].classList.add("invalid")
        setTimeout(() => {
            document.getElementsByClassName("modal-container")[0].classList.remove("invalid")
            // document.getElementsByClassName("modal-content-number-shares")[0].children[0].classList.remove("invalid")
        }, 750)
        return
    }  
    const currentPrice = parseFloat(document.getElementsByClassName("modal-content-trade-info-inputs")[0].children[2].children[0].innerText)
    userDocument.latestPortfolio[ticker].lastPrice = currentPrice

    if (sellingSecurity) {
        if (numSharesTraded > userDocument.latestPortfolio[ticker]["shares"]) {
            throw Error("Selling more shares than you currently own")
            return
        }
        if(numSharesTraded == userDocument.latestPortfolio[ticker]["shares"]){
            userDocument.latestPortfolio[ticker] = null;
        }
        else{
            userDocument.latestPortfolio[ticker]["totalReturn"] = floatToCurrency(userDocument.latestPortfolio[ticker]["totalReturn"] * (1-(numSharesTraded/userDocument.latestPortfolio[ticker]["shares"])))
            userDocument.latestPortfolio[ticker]["shares"] -= numSharesTraded
        }
        creditCashAccount(numSharesTraded * executionPrice)
    }
    else {
        if (numSharesTraded * executionPrice > userDocument.latestPortfolio.Cash) {
            console.log(`Not enough cash on hand: @${userDocument.latestPortfolio.Cash}`)
            return
        }
        creditCashAccount(-numSharesTraded * executionPrice)
        const totalCost = userDocument.latestPortfolio[ticker].averageCost * userDocument.latestPortfolio[ticker].shares + numSharesTraded * executionPrice
        // console.log("Current num shares ", userDocument.latestPortfolio[ticker].shares)
        userDocument.latestPortfolio[ticker].shares += numSharesTraded
        // console.log("After buying ",numSharesTraded, " shares...total: ", userDocument.latestPortfolio[ticker].shares)
        const newAverageCost = totalCost / userDocument.latestPortfolio[ticker].shares
        userDocument.latestPortfolio[ticker].averageCost = newAverageCost
        const newTotalReturn = (userDocument.latestPortfolio[ticker].lastPrice - newAverageCost) * userDocument.latestPortfolio[ticker].shares
        userDocument.latestPortfolio[ticker].totalReturn = floatToCurrency(newTotalReturn)
    }


    sellingSecurity = null;
    updatePortfolioPositionHTML(ticker)
    closeModal()
}
function creditCashAccount(amount) {
    userDocument.latestPortfolio.Cash += amount
    if (userDocument.latestPortfolio.Cash < 0) {
        console.log("You are broke...")
    }
}

function floatToCurrency(float) {
    return parseFloat(float.toFixed(2))
}
function updatePortfolioPositionHTML(ticker = null) {
    if (ticker == null || !userDocument.latestPortfolio.hasOwnProperty(ticker)) {
        return
    }
    else {
        positionComponent = document.getElementById("stock-container-" + ticker)
        if (positionComponent != null){
            if(ticker == "Cash"){
                document.getElementById("stock-container-Cash").children[1].innerText = `$${userDocument.latestPortfolio.Cash}`
            }
            else{
                numSharesLabel = positionComponent.children[0].children[1]
                console.log(numSharesLabel)
                numSharesLabel.innerText = String(userDocument.latestPortfolio[ticker].shares).concat((userDocument.latestPortfolio[ticker].shares > 1) ? ' shares' : ' share')
            }
        }
        else{
            // Create the HTML
            // console.log("Need to generate the position's HTML")
            const positionHTML = generatePortfolioPositionHTML(ticker)
            document.getElementById("portfolio-list-container").insertAdjacentHTML("beforeend",positionHTML)
        }
    }
}
function updatePortfolioHTML(){
    Object.keys(userDocument.latestPortfolio).forEach(position => {
        if (position != "undefined"){
            // console.log(position)
            updatePortfolioPositionHTML(position)
        }
    });
}


function getStockQuote(ticker,callback) {
    fetch(`https://cloud.iexapis.com/stable/stock/${ticker}/delayed-quote/?token=sk_a149a5ec86134cafb9d1f13e78bf3af6`).then(
        (resp)=>{
            return resp.json()
        }
    ).then((json)=>{
        // console.log(json)
        callback(json)
    })
}