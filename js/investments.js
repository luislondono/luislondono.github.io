var firebaseConfig = {
    apiKey: "AIzaSyCSFoOcUMAULAn6ScMSgygfS_fZcnVTpSk",
    authDomain: "luislondono-com.firebaseapp.com",
    databaseURL: "https://luislondono-com.firebaseio.com",
    projectId: "luislondono-com",
    storageBucket: "luislondono-com.appspot.com",
    messagingSenderId: "851373763529",
    appId: "1:851373763529:web:c171fe15b7d82883"
};


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






async function setupSpecificPage() {
    const pageName = window.location.pathname.split("/").pop()
    console.log("Setting up: ", pageName)
    firebase.initializeApp(firebaseConfig);
    portfolioCollection = firebase.firestore().collection("portfolioCollection")


    var provider = new firebase.auth.GoogleAuthProvider();
    // provider.addScope('profile');
    // provider.addScope('https://www.googleapis.com/auth/drive');
    firebase.auth().useDeviceLanguage()

    firebase.auth().signInWithPopup(provider).then(async function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        userEmail = user.email
        console.log(user)
        document.getElementById("page-title").insertAdjacentHTML("afterend", `<h3 id = "client-name-title" >${user.email}</h3 >`)
        userDocument = await fetchPortfolio(userEmail)
        renderUserPortfolio()

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
    stockSearchBarInputElement.onkeyup = function (e) {
        clearTimeout(searchBarTimeout);
        searchBarTimeout = setTimeout(function () {
            executeStockSearchQuery()
        }, 100);
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
            console.log("Clicked outside search container")
            escapeSearchField()
        }
    }


    if (userDocument === undefined) {
        userDocument = {
            "historicalPortfolioValue": {},
            "latestPortfolio": {}
        }
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
    // console.log("Endpoint: ", url)
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

function updatePorfolio(email, portfolio) {
    portfolioCollection.doc(email).update(portfolio)
        .then(function () {
            console.log("Document successfully updated!");
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}

// folio = { latestPortfolio: { date: new Date(), "APPL": { "shares": 5, "price": 100, "companyName": "Apple" }, "MSFT": { "shares": 3, "price": 90, "companyName": "Microsoft" } } }


function renderUserPortfolio() {
    portfolioHTMLContainer = document.getElementById("portfolio-list-container")
    Object.entries(userDocument.latestPortfolio).forEach(security => {
        ticker = security[0]
        assetInfo = security[1]
        const stockComponentHTML = '<div class="stock-container"> <div class="company-info"> <span> <h4>' + assetInfo.companyName + '</h4> <h4>&nbsp$(&nbsp</h4> <h4>' + ticker + '</h4> <h4>&nbsp)</h4> </span> <span> <h5 class="num-shares-label">' + assetInfo.shares + '</h5> </span> </div> <div class="company-price-container"> <h4>' + assetInfo.price + '</h4> </div> </div>';
        portfolioHTMLContainer.insertAdjacentHTML("beforeend", stockComponentHTML)
    });
}

function executeStockSearchQuery() {
    query = stockSearchBarInputElement.value.trim()
    if (query != "" && query != cachedQuery) {
        // console.log("Continuing with requested query: ", query)
        const req = {
            "function": "SYMBOL_SEARCH",
            "keywords": query
        }
        queryAlphaVantage(req, function (result) {
            console.log(result)

            if (!result.hasOwnProperty("bestMatches")) {
                console.log("Overloaded API, try again later")
            }
            else {
                console.log(result.bestMatches)
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

function generatePortfolioPositionHTML(companyName, ticker, numShares) {
    // return '<div class="stock-container" id= "stock-container-'+ticker+'"> <div class="company-info"> <span> <h4 class="company-info-name">'+companyName+'</h4> <h4><h4>&nbsp$</h4><h4 class="company-info-ticker">'+ticker+'</h4></h4> </span> <h5 class="num-shares-label">'+numShares+'&nbspshare'+ (numShares>1? 's':'')+'</h5> </div> <div class="company-price-container"> <h4>Price</h4> </div> </div>'
    return '<div class="stock-container" id= "stock-container-' + ticker + '"> <div class="company-info"> <span> <h4 class="company-info-name">' + companyName + '</h4> <h4><h4>&nbsp$</h4><h4 class="company-info-ticker">' + ticker + '</h4></h4> </span> <h5 class="num-shares-label">' + numShares + '&nbspshare' + (numShares > 1 ? 's' : '') + '</h5> </div> <div class="company-price-container"> <h4></h4> </div> </div>'
}

async function generateAddSecurityModal(companyName, ticker) {
    req = {
        "function": "GLOBAL_QUOTE",
        "symbol": ticker
    }
    var numSharesInPortfolio;
    try {
        numSharesInPortfolio = userDocument.latestPortfolio[ticker] == undefined ? 0 : userDocument.latestPortfolio[ticker]["shares"]
    } catch (error) {
        if (error instanceof TypeError) {
            numSharesInPortfolio = 0
        }
    }

    var modal = '<div id="add-stock-from-search-modal" class="modal"> <div class="modal-container"> <button class="close" onclick="closeModal()">&times;</button> <div class="modal-content-securities"> <div class="modal-content-security-info"> <span> <h2>' + companyName + ' <h3>$' + ticker + '</h3> </h2> </span> <h3 class="modal-content-number-shares">Number of shares<input type="text" value = "' + numSharesInPortfolio + '"></h3> <h3 class="modal-content-security-trading-price">Current Price: $<span> Loading ...</span></h3> </div> <Button id="add-to-portfolio-button" onclick="handleAddSecurityToPortfolioFromModal()"> Add <i class="material-icons right">send</i> </Button> </div> </div> </div>'
    // console.log(element)
    document.getElementById("page-content").insertAdjacentHTML("afterend", modal)

    queryAlphaVantage(req, function (json) {
        // console.log(json)
        if (!json.hasOwnProperty("Global Quote")) {
            console.log("Blew past rate limit")
            document.getElementsByClassName("modal-content-security-trading-price")[0].children[0].innerText = " Try again later!"
        }
        else {
            currentPrice = Math.ceil(parseFloat(json["Global Quote"]["05. price"]) * 100) / 100
            document.getElementsByClassName("modal-content-security-trading-price")[0].children[0].innerText = currentPrice
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

function handleAddSecurityToPortfolioFromModal() {
    const ModalElement = document.getElementById("add-stock-from-search-modal")
    const companyName = document.getElementsByClassName("modal-content-security-info")[0].children[0].children[0].innerText
    const currentPrice = document.getElementsByClassName("modal-content-security-trading-price")[0].children[0].innerText
    const companyTicker = document.getElementsByClassName("modal-content-security-info")[0].children[0].children[1].innerText.substring(1)
    const numShares = parseInt(document.getElementsByClassName("modal-content-number-shares")[0].children[0].value)

    if document.getElementById("stock-container-" + companyTicker) == null

    console.log("Attempting to add security: ", companyTicker, " with name: ", companyName, " to portfolio")
    document.getElementById("portfolio-list-container").insertAdjacentHTML("beforeend", generatePortfolioPositionHTML(companyName, companyTicker, numShares))

    userDocument.latestPortfolio[companyTicker] = {
        "companyName": companyName,
        "price": currentPrice,
        "shares": numShares
    }

    escapeSearchField()
    closeModal()



}