window.onload = setUpWindow
var firebaseConfig = {
  apiKey: "AIzaSyCSFoOcUMAULAn6ScMSgygfS_fZcnVTpSk",
  authDomain: "luislondono-com.firebaseapp.com",
  databaseURL: "https://luislondono-com.firebaseio.com",
  projectId: "luislondono-com",
  storageBucket: "luislondono-com.appspot.com",
  messagingSenderId: "851373763529",
  appId: "1:851373763529:web:c171fe15b7d82883"
};

let messageBoard;
let ipHistory;
let messageBoardPosts = []
let clientInfo;
let numQuestionsToday = 0;
let dailylimit = 4;
let exceededDailyMessagesPopup = "Exceeded max number of posts today!"
upvoteColor = [255, 174, 26]
downvoteColor = [144, 215, 243]

bonusProfanities = "fck,"
profanityAlertMessage = "Want to use adult words? Go to an adult website then..."
redirectLink = "https://www.pornhub.com"

const emptyMessageBoardElement = '<div id="empty-message-board-post"> <div> No posts have been made 😢 </div> </div>'

// const emptyMessageBoardMessage = <div class="message-board-post"><h3> No posts have been made :( </h3></div>
function setUpWindow() {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  document.getElementById("message-board-post-submittor-button").addEventListener("click", handleSubmit)

  updateMessageBoard()

}
async function updateMessageBoard() {




  messageBoard = firebase.firestore().collection("anonymousMessageBoard")
  ipHistory = firebase.firestore().collection("ipVotingHistory")

  await messageBoard.orderBy("postScore", "desc").orderBy("dateValue", "desc").limit(7).get()
    .then(
      querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          messageBoardPosts.push(doc.data());
        });
        getClientInfo()
      }
    ).then(
      function () {
        if (messageBoardPosts.length == 0) {
          document.getElementById("message-board-posts").innerHTML = emptyMessageBoardElement
          // getClientInfo()
        }
        else {
          messageBoardPosts.forEach(post => {
            addPostToMessageBoard(post, false)
          })
          console.log("Done adding all posts")
          // getClientInfo()
          // console.log(clientInfo)

          messageBoardPosts.forEach(post => {
            IPsMatch = post["ip"] == clientInfo["ip"]
            daysMatch = sameDay(new Date(Date.parse(post["date"])), new Date())
            if (IPsMatch && daysMatch) {
              numQuestionsToday += 1;
            }

            renderActiveVoteButtons(post)


          })

          if (numQuestionsToday >= dailylimit) {
            document.getElementById("submittor-question-field").placeholder = exceededDailyMessagesPopup
          }
        }

      }
    )


}

function renderActiveVoteButtons(postObject) {
  // try {
  //   postWasUpvoted = postObject["upvoters"].indexOf(clientInfo["ip"]) > -1
  // }
  // finally {
  //   postWasUpvoted = false
  // }
  // try {
  //   postWasDownvoted = postObject["downvoters"].indexOf(clientInfo["ip"]) > -1
  // }
  // finally {
  //   postWasDownvoted = false
  // }
  // console.log(postObject)
  // console.log(clientInfo)

  postWasUpvoted = postObject["upvoters"].indexOf(clientInfo["ip"]) > -1
  postWasDownvoted = postObject["downvoters"].indexOf(clientInfo["ip"]) > -1
  if (postWasUpvoted) {
    // const iconInQuestion = document.getElementById("downvote-button" + postObject["UUID"]).childNodes[0].childNodes[1].childNodes[1]
    const buttonInQuestion = document.getElementById("upvote-button-" + postObject["UUID"])
    buttonInQuestion.className = "message-board-post-rating-button-active"
    buttonInQuestion.style.color = "RGB(" + upvoteColor[0] + "," + upvoteColor[1] + "," + upvoteColor[2] + ")"
  }
  else if (postWasDownvoted) {
    const buttonInQuestion = document.getElementById("downvote-button-" + postObject["UUID"])
    buttonInQuestion.className = "message-board-post-rating-button-active"
    buttonInQuestion.style.color = "RGB(" + downvoteColor[0] + "," + downvoteColor[1] + "," + downvoteColor[2] + ")"
  }
}



function addPostToMessageBoard(postObject, throughSubmit) {
  let answerField;
  if (postObject["answer"] == "") {
    answerField = "Unanswered..."
  } else {
    answerField = "A: " + postObject["answer"]
  }
  const newpost = '<div class="message-board-post" id = "' + postObject["UUID"] + '"><div class="message-board-post-rating-container"> <div class="message-board-post-rating"> <button class="message-board-post-rating-button-inactive" id="upvote-button-' + postObject["UUID"] + '"> <i class="material-icons" style="font-size:24px;">thumb_up</i> </button > <div class="message-board-post-rating-score" id = "message-board-post-rating-score-' + postObject["UUID"] + '">' + postObject["postScore"] + '</div> <button class="message-board-post-rating-button-inactive" id="downvote-button-' + postObject["UUID"] + '"> <i class="material-icons" style="font-size:24px;">thumb_down</i> </button > </div > </div > <div class="message-board-post-content"> <div class="message-board-post-question"> Q: ' + postObject["question"] + '</div> <div class="message-board-post-answer">' + answerField + '</div> </div ></div > '
  if (messageBoardPosts.length == 0) {
    console.log("Reseting inner html")
    document.getElementById("message-board-posts").innerHTML = newpost;
  }
  else {
    document.getElementById("message-board-posts").insertAdjacentHTML("beforeend", newpost)
  }

  if (throughSubmit) {
    messageBoardPosts.push(postObject)
    renderActiveVoteButtons(postObject)
  }

  // addedPostElement = document.getElementById(postObject["UUID"])
  upVoteButton = document.getElementById('upvote-button-' + postObject["UUID"])
  console.log("grabbing upvote button: ", upVoteButton)
  downVoteButton = document.getElementById('downvote-button-' + postObject["UUID"])
  console.log("grabbing downvote button: ", downVoteButton)
  upVoteButton.addEventListener("click", () => {
    console.log("Attempting to Upvote...")
    handleVote(postObject["UUID"], true)
  })
  downVoteButton.addEventListener("click", () => {
    console.log("Attempting to downvote...")
    handleVote(postObject["UUID"], false)
  })
  // onclick = "handleVote(\'' + postObject["UUID"] + '\',true)"
  // onclick = "handleVote(\'' + postObject["UUID"] + '\',false)"

}



function handleSubmit() {
  questionField = document.getElementById("submittor-question-field").value


  if (questionField.trim() == "") {
    return
  }
  else if (numQuestionsToday >= dailylimit) {
    handleTooManyPostsToday()
    console.log("You've exceeded the number of questions today!")
    return
  }
  else if (containsProfanity(questionField)) {
    console.log("Tried to post a profanity...")
    alert(profanityAlertMessage)
    window.location.replace(redirectLink)
    return

  }
  else {
    let post = {}
    currentDateObject = new Date()
    post["date"] = currentDateObject.toGMTString()
    post["dateValue"] = currentDateObject.valueOf()
    post["question"] = questionField
    post["UUID"] = generateUUID()
    post["postScore"] = 1
    post["upvoters"] = [clientInfo["ip"]]
    post["downvoters"] = []
    post["answer"] = ""
    console.log("Clicked!")
    messageBoard.doc(post["UUID"]).set(
      {
        date: post["date"],
        dateValue: post["dateValue"],
        question: post["question"],
        ip: clientInfo["ip"],
        answer: "",
        UUID: post["UUID"],
        postScore: 1,
        upvoters: [clientInfo["ip"]],
        downvoters: []
      }
    )

    addPostToMessageBoard(post, true)
    numQuestionsToday += 1
    const postIndex = messageBoardPosts.indexOf(post)

    if (!messageBoardPostsInOrder()) {
      console.log("Sorting message board again...")
      messageBoardPosts.sort(
        sortClassifierScoreDateValue
      )
      const newIndex = messageBoardPosts.indexOf(post)
      console.log("Post moved from index ", postIndex, " to ", newIndex)
      movePost(postIndex, newIndex)
    }

  }
}


async function DeleteAllPosts() {
  await messageBoard.get()
    .then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        messageBoard.doc(doc.id).delete()
      });
    }).then(function () {
      messageBoardPosts = [];
      updateMessageBoard()
      numQuestionsToday = 0
    })
}

function getClientInfo() {
  console.log("Getting clientInfo...")

  url = 'https://json.geoiplookup.io/'

  var xmlHttp = new XMLHttpRequest();

  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      clientInfo = (JSON.parse(xmlHttp.responseText))
  }
  xmlHttp.open("GET", url, false); // true for asynchronous
  xmlHttp.send(null);

}

function containsProfanity(text) {
  console.log("Checking if :\n", text, "\n contains profanity...")

  url = 'https://www.purgomalum.com/service/containsprofanity?text=' + text + '&add=' + bonusProfanities

  var xmlHttp = new XMLHttpRequest();

  let result;

  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      // console.log(xmlHttp.responseText)
      result = xmlHttp.response === 'true'
    }
  }
  xmlHttp.open("GET", url, false); // true for asynchronous
  xmlHttp.send(null);

  return result
}



function sameDay(d1, d2) {
  // console.log("d1: ", d1, "\nd2: ", d2)
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


async function handleVote(postUUID, isUpvote) {
  const multiplier = isUpvote ? 1 : -1;
  let postIndex;
  for (let index = 0; index < messageBoardPosts.length; index++) {
    if (messageBoardPosts[index]["UUID"] == postUUID) {
      postIndex = index
      break;
    }
  }

  postInQuestion = messageBoardPosts[postIndex]
  // console.log("Clicked " + `${isUpvote ? "up" : "down"}` + "vote button on post:", postUUID, "@ index: ", postIndex)
  if (isUpvote && messageBoardPosts[postIndex]["upvoters"].indexOf(clientInfo["ip"]) > -1) {
    console.log("Cannot upvote twice!")
    return
  }
  if (!isUpvote && messageBoardPosts[postIndex]["downvoters"].indexOf(clientInfo["ip"]) > -1) {
    console.log("Cannot downvote twice!")
    return
  }

  // await messageBoard.doc(postUUID).get().then((doc) => {
  //   console.table(doc.data())
  // })

  newScore = messageBoardPosts[postIndex]["postScore"] + (1 * multiplier);
  // console.table(messageBoardPosts[postIndex])

  messageBoardPosts[postIndex]["postScore"] = newScore

  upvoteIcon = document.getElementById(messageBoardPosts[postIndex]["UUID"]).childNodes[0].childNodes[1].childNodes[1]
  downvoteIcon = document.getElementById(messageBoardPosts[postIndex]["UUID"]).childNodes[0].childNodes[1].childNodes[5]
  if (isUpvote) {
    if (messageBoardPosts[postIndex]["downvoters"].indexOf(clientInfo["ip"]) > -1) {
      // post was previously downvoted, revert to zero, remove downvote class
      messageBoardPosts[postIndex]["downvoters"].splice(messageBoardPosts[postIndex]["downvoters"].indexOf(clientInfo["ip"]), 1)
      downvoteIcon.className = "message-board-post-rating-button-inactive"
      downvoteIcon.style.color = ""
    }
    else {
      // post wasn't previously downvoted, activate upvote class
      messageBoardPosts[postIndex]["upvoters"].push(clientInfo["ip"])
      upvoteIcon.className = "message-board-post-rating-button-active"
      upvoteIcon.style.color = "RGB(" + upvoteColor[0] + "," + upvoteColor[1] + "," + upvoteColor[2] + ")"
    }
  }
  else {
    if (messageBoardPosts[postIndex]["upvoters"].indexOf(clientInfo["ip"]) > -1) {
      // post was previously upvoted, revert to zero
      // const indexOfUpvoteIP = messageBoardPosts[postIndex]["upvoters"].indexOf(clientInfo["ip"])
      // console.log("post was previously upvoted, revert to zero, upvoteIP index: ", indexOfUpvoteIP)
      messageBoardPosts[postIndex]["upvoters"].splice(messageBoardPosts[postIndex]["upvoters"].indexOf(clientInfo["ip"]), 1)
      upvoteIcon.className = "message-board-post-rating-button-inactive"
      upvoteIcon.style.color = ""
    }
    else {
      console.log("post was never upvoted, adding to downvoters list")
      messageBoardPosts[postIndex]["downvoters"].push(clientInfo["ip"])
      downvoteIcon.className = "message-board-post-rating-button-active"
      downvoteIcon.style.color = "RGB(" + downvoteColor[0] + "," + downvoteColor[1] + "," + downvoteColor[2] + ")"
    }
  }

  document.getElementById("message-board-post-rating-score-" + postUUID).innerText = newScore

  await messageBoard.doc(postUUID).update(
    {
      postScore: newScore,
      upvoters: messageBoardPosts[postIndex]["upvoters"],
      downvoters: messageBoardPosts[postIndex]["downvoters"],
    }
  )

  if (!messageBoardPostsInOrder()) {
    console.log("Sorting message board again...")
    messageBoardPosts.sort(
      sortClassifierScoreDateValue
    )
    const newIndex = messageBoardPosts.indexOf(postInQuestion)
    console.log("Post moved from index ", postIndex, " to ", newIndex)
    movePost(postIndex, newIndex)
  }
}

function messageBoardPostsInOrder() {
  prevScore = Number.MAX_SAFE_INTEGER
  prevDateValue = Number.MIN_SAFE_INTEGER
  const renderedMessageBoard = document.getElementById("message-board-posts").children
  for (let index = 0; index < renderedMessageBoard.length; index++) {
    const postUUID = renderedMessageBoard[index].id
    const score = parseInt(document.getElementById("message-board-post-rating-score-" + postUUID).innerText)
    const postDateValue = messageBoardPosts[index]["dateValue"]

    if (score > prevScore) {
      return false;
    }
    if (score == prevScore && postDateValue < prevDateValue) {
      return false
    }
    prevScore = score
    prevDateValue = postDateValue
  }
  return true
}


function swapPosts(index1, index2) {
  console.log("Swapping post at ", index1, " with post at index ", index2)
  if (index1 == index2) {
    return
  }

  parent = document.getElementById("message-board-posts")
  child1 = parent.children[index1]
  child2 = parent.children[index2]
  if (Math.abs(index1 - index2) == 1) {
    if (index2 > index1) {
      parent.insertBefore(child2, child1)
    }
    else {
      parent.insertBefore(child1, child2)
    }
  }
  child3 = parent.children[index1 + 1]
  // Puts child1 before child2
  parent.insertBefore(child1, child2)

  parent.insertBefore(child2, child3)
}

function movePost(initialIndex, finalIndex) {
  parent = document.getElementById("message-board-posts")
  if (initialIndex == finalIndex) { return }
  // if (Math.abs(initialIndex - finalIndex) == 1) {
  //   swapPosts(initialIndex, finalIndex)
  // }
  // else if (finalIndex == parent.children.length - 1) {
  //   console.log("Moving to the end")
  //   child = parent.children[initialIndex]
  //   parent.appendChild(child)
  // }

  // // else if(finalIndex == 0){
  // //   parent = document.getElementById("message-board-posts")
  // //   child = parent.children[initialIndex]
  // //   childDestinationNext = parent.children[finalIndex]
  // //   parent.insertBefore(child,childDestinationNext)
  // // }
  // else {
  //   child = parent.children[initialIndex]
  //   childDestinationNext = parent.children[finalIndex]
  //   parent.insertBefore(child, childDestinationNext)
  // }
  let currentIndex = initialIndex
  directionDown = (finalIndex > initialIndex)
  while (currentIndex != finalIndex) {
    if (directionDown) {
      swapPosts(currentIndex, currentIndex + 1)
      currentIndex += 1
    }
    else {
      swapPosts(currentIndex, currentIndex - 1)
      currentIndex -= 1
    }
  }
}

function handleTooManyPostsToday() {
  textareaElement = document.getElementById("submittor-question-field")
  textareaElement.className = "animated shake 1s"
  // alert(exceededDailyMessagesPopup)
  textareaElement.placeholder = exceededDailyMessagesPopup
  textareaElement.value = exceededDailyMessagesPopup
  setTimeout(() => { textareaElement.className = "" }, 1000)
}

function sortClassifierScoreDateValue(a, b) {
  if (b["postScore"] > a["postScore"]) {
    return 1
  }
  if (a["postScore"] > b["postScore"]) {
    return -1
  }
  if (a["dateValue"] > b["dateValue"]) {
    return -1
  }
  if (a["dateValue"] < b["dateValue"]) {
    return 1
  }
}
