window.onload = updateMessageBoard
let messageBoard; 


function updateMessageBoard() {
  messageBoard = firebase.firestore().collection("anonymousMessageBoard")

  console.log("updating Message Board")

  getPosts().then(res => console.table(res))
}

async function getPosts(){
  const posts = [];
  const snapshot = await messageBoard.get()
  .then(querySnapshot => {
    querySnapshot.docs.forEach(doc => {
    posts.push(doc.data());
  });
});
  return posts
}

function addPostToMessageBoard(question,answer) {
  const newpost = '<div class = "message-board-post"><div class="message-board-post-question">' + question + '</div><div class="message-board-post-answer">' + answer + '</div></div>';
  document.getElementById("message-board-posts").innerHTML += newpost

}

function handleSubmit() {
  const questionDateField = new Date().toGMTString()
  const questionField = document.getElementById("submittor-question-field").value
  console.log(questionField)
  console.log("Clicked!")
  messageBoard.doc().set({ Date: questionDateField, Question: questionField })

  addPostToMessageBoard(questionDateField, questionField)
}