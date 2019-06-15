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
var stockSearchBarElement;
var searchBarTimeout = null;
var cashedQuery = null;




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
    stockSearchBarElement = document.getElementById('stock-search-bar')
    stockSearchBarElement.onkeyup = function (e) {
        clearTimeout(searchBarTimeout);
        searchBarTimeout = setTimeout(function () {
            executeStockSearchQuery()
        }, 500);
    }



}

function constructEndpoint(request) {
    var result = "https://www.alphavantage.co/query?function=" + request["function"]
    const key = "8U6YN0U5W56PA5XE"


    if (request["function"] == "GLOBAL_QUOTE") {
        console.log("Getting a global_quote")
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
    query = stockSearchBarElement.value
    if (query != cashedQuery) {
        cashedQuery = query
        const req = {
            "function": "SYMBOL_SEARCH",
            "keywords": query
        }
        queryAlphaVantage(req, function (result) {
            console.log(result.bestMatches)
            if (result != undefined) {
                document.getElementsByClassName("search-results-container")[0].innerHTML = null
                document.getElementsByClassName("search-results-container")[0].id = null;
                document.getElementsByClassName("stock-search-bar-container")[0].id = "stock-search-bar-container-with-results"
                result.bestMatches.forEach(match => renderSearchMatchResult(match))
            }
        })
    }

}

function renderSearchMatchResult(match) {
    if (match["4. region"] == "United States") {
        const resultElement = '<div class="search-result"> <h4 class="search-result-symbol">' + match["1. symbol"] + '</h4> <h4 class="search-result-company-name">' + match["2. name"] + '</h4> </div>'
        document.getElementsByClassName("search-results-container")[0].insertAdjacentHTML("beforeend", resultElement)
    }
}