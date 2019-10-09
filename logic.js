const config = {
  apiKey: "AIzaSyB1eevWjVvk0MkE-_ar1VI1i0LNf_XrIi0",
  authDomain: "post-it-6cc95.firebaseapp.com",
  databaseURL: "https://post-it-6cc95.firebaseio.com",
  projectId: "post-it-6cc95",
  storageBucket: "",
  messagingSenderId: "211257113895",
  appId: "1:211257113895:web:314a52754c1f877dfcbd02"
};

firebase.initializeApp(config);

const db = firebase.database().ref();

const posts = db.child("posts");
const comments = db.child("comments");

posts.on("child_added", function(snapshot) {
  const data = snapshot.val();
  const body = data.body;
  const result = document.getElementById("result");
  const container = document.createElement("div");
  const heading = document.createElement("h2");
  const comment = document.createElement("p");
  const feedContain = document.createElement("div");
  const feedback = document.createElement("input");
  const feedBtn = document.createElement("button");
  const collapse = document.createElement("button");

  container.className = "postBox w-70 pa3 tl center";
  container.id = `postBox${data.postNum}`;
  heading.className = "heading tl";
  heading.id = `heading${data.postNum}`;
  comment.className = "comment";
  comment.id = `comment${data.postNum}`;
  feedContain.className = "commentBox";
  feedBtn.innerHTML = "Add Comment";
  feedBtn.id = `addComment${data.postNum}`;
  feedback.id = `replyBox${data.postNum}`;
  feedback.className = "txtBox";
  feedBtn.className = "txtBtn";
  collapse.className = "collapsible";
  collapse.id = `collapsible${data.postNum}`
  collapse.innerHTML = "Click to Add/View Comments";

  const title = document.createTextNode(`Post #${data.postNum}`);
  let input;

  if (body.substring(0, 4) === "pic:" || body.substring(0, 4) === "Pic:") {
    input = document.createElement("img");
    input.src = body.substring(4);
    input.className = "pics";
  } else {
    input = document.createTextNode(body);
  }

  heading.appendChild(title);
  comment.appendChild(input);
  container.appendChild(comment);
  comment.before(heading);
  feedContain.appendChild(feedback);
  feedContain.appendChild(feedBtn);
  container.appendChild(collapse);
  container.appendChild(feedContain);
  result.appendChild(container);

  const coll = document.getElementById(`collapsible${data.postNum}`);
  coll.addEventListener("click", function() {
    this.classList.toggle("active");
    const content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });

  const box = document.getElementById(`addComment${data.postNum}`);
  box.addEventListener(
    "click",
    () => {
      const reply = document.getElementById(`replyBox${data.postNum}`).value;
      if (reply.trim() !== "") {
        comments.push({ forPost: data.postNum, body: reply });
        document.getElementById(`replyBox${data.postNum}`).value = "";
      } else {
        alert("You can't post nothing, bruh.");
      }
    },
    false
  );
});

comments.on("child_added", function(snapshot) {
  const data = snapshot.val();
  const content = Object.values(data);

  const body = data.body;
  const post = document.createElement("p");
  post.className = "reply";
  const input = document.createTextNode(body);
  post.appendChild(input);
  const box = document.getElementById(`replyBox${data.forPost}`);
  box.before(post);
});

const createPost = () => {
  const msg = document.getElementById("msg").value;
  if (msg.trim() !== "") {
    posts.once("value", function(snapshot) {
      const res = snapshot.val();
      const content = Object.values(res);
      const postCt = content.length + 1;
      posts.push({ postNum: postCt, body: msg, commentCT: 0 });
    });
    document.getElementById("msg").value = "";
  } else {
    alert("You can't post nothing, bruh.");
  }
};

const post = document.getElementById("post");
post.addEventListener("click", createPost, false);
