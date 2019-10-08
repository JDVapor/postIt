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

posts.on("value", function(snapshot) {
  const res = snapshot.val();
  const content = Object.values(res);

  content.map((data, index) => {
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
    container.id = `postBox${index + 1}`;
    heading.className = "heading tl";
    heading.id = `heading${index + 1}`;
    comment.className = "comment";
    comment.id = `comment${index + 1}`;
    feedContain.className = "commentBox";
    feedBtn.innerHTML = "Add Comment";
    feedBtn.id = `addComment${index + 1}`;
    feedback.id = `replyBox${index + 1}`;
    feedback.className = "txtBox";
    feedBtn.className = "txtBtn";
    collapse.className = "collapsible";
    collapse.innerHTML = "Click to Add/View Comments";

    const title = document.createTextNode(`Post #${index + 1}`);
    let input = body;

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

    const box = document.getElementById(`addComment${index + 1}`);
    box.addEventListener(
      "click",
      () => {
        const reply = document.getElementById(`replyBox${index + 1}`).value;
        if (reply.trim() !== "") {
          comments.once("value", function(snapshot) {

            comments.push({ forPost: index + 1, body: reply });

            document.getElementById(`replyBox${index + 1}`).value = "";
          });
        } else {
          alert("You can't post nothing, bruh.");
        }
      },
      false
    );
  });

  const coll = document.getElementsByClassName("collapsible");
  let i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
});

comments.on("value", function(snapshot) {
  const res = snapshot.val();
  const content = Object.values(res);

  content.map((data, index) => {
    const body = data.body;
    const post = document.createElement("p");
    post.className = "reply";
    const input = document.createTextNode(body);
    post.appendChild(input);
    const box = document.getElementById(`replyBox${data.forPost}`);
    box.before(post);
  });
});

const getComment = () => {
  const msg = document.getElementById("msg").value;

  if (msg.trim() !== "") {
    posts.once("value", function(snapshot) {

      const res = snapshot.val();
      const content = Object.values(res);
      const postCt = content.length + 1;
      posts.push({ postNum: postCt, body: msg });

      document.getElementById("msg").value = "";
    });
  } else {
    alert("You can't post nothing, bruh.");
  }
};

const post = document.getElementById("post");
post.addEventListener("click", getComment, false);
