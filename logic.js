const config = {
  apiKey: "AIzaSyB1eevWjVvk0MkE-_ar1VI1i0LNf_XrIi0",
  authDomain: "post-it-6cc95.firebaseapp.com",
  databaseURL: "https://post-it-6cc95.firebaseio.com",
  projectId: "post-it-6cc95",
  storageBucket: "post-it-6cc95.appspot.com",
  messagingSenderId: "211257113895",
  appId: "1:211257113895:web:314a52754c1f877dfcbd02"
};

firebase.initializeApp(config);

const db = firebase.database().ref();
const storage = firebase.storage().ref();

const posts = db.child("posts");
const comments = db.child("comments");
const imgs = storage.child("images");

window.addEventListener("load", function() {
  document
    .querySelector('input[type="file"]')
    .addEventListener("change", function() {
      if (this.files && this.files[0]) {
        const imgName = this.files[0].name;
        const checkType = isImage(imgName);
        if (checkType) {
          storage
            .child(`images/${imgName}`)
            .put(this.files[0])
            .then(function(snapshot) {
              console.log("Uploaded image");
              storage
                .child(`images/${imgName}`)
                .getDownloadURL()
                .then(function(url) {
                  console.log(url);
                  const post = document.getElementById("msg");
                  const src = url;
                  msg.innerHTML = `pic: ${src}`;
                  createPost();
                });
            });
        } else {
          alert("Needs to be an image!");
        }
      }
    });
});

posts.on("child_added", function(snapshot) {
  const data = snapshot.val();
  const body = data.body;
  let cmtCT = data.commentCT;
  let upCT = data.up;
  let downCT = data.down;

  const result = document.getElementById("result");
  const container = document.createElement("div");
  const heading = document.createElement("h2");
  const comment = document.createElement("p");
  const feedContain = document.createElement("div");
  const feedback = document.createElement("input");
  const feedBtn = document.createElement("button");
  const collapse = document.createElement("button");
  const upV = document.createElement("button");
  const downV = document.createElement("button");

  container.className = "postBox w-60 pa3 tl center";
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
  collapse.id = `collapsible${data.postNum}`;
  collapse.innerHTML = `Click to Add/View Comments (${cmtCT})`;
  upV.className = "like";
  upV.id = `likeFor${data.postNum}`;
  upV.innerHTML = `👍 (${upCT})`;
  downV.className = "dislike";
  downV.id = `dislikeFor${data.postNum}`;
  downV.innerHTML = `👎 (${downCT})`;

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
  comment.after(downV);
  comment.after(upV);
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
  box.addEventListener("click", () => {
    const reply = document.getElementById(`replyBox${data.postNum}`).value;
    if (reply.trim() !== "") {
      cmtCT++;
      snapshot.ref.update({ commentCT: cmtCT });
      collapse.innerHTML = `Click to Add/View Comments (${cmtCT})`;
      comments.push({ forPost: data.postNum, body: reply });
      document.getElementById(`replyBox${data.postNum}`).value = "";
    } else {
      alert("You can't post nothing, bruh.");
    }
  });

  const like = document.getElementById(`likeFor${data.postNum}`);
  like.addEventListener("click", () => {
    upCT++;
    snapshot.ref.update({ up: upCT });
    upV.innerHTML = `👍 (${upCT})`;
  });

  const dislike = document.getElementById(`dislikeFor${data.postNum}`);
  dislike.addEventListener("click", () => {
    downCT++;
    snapshot.ref.update({ down: downCT });
    downV.innerHTML = `👎 (${downCT})`;
  });
});

comments.on("child_added", function(snapshot) {
  const data = snapshot.val();
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
      posts.push({ postNum: postCt, body: msg, commentCT: 0, up: 0, down: 0 });
    });
    document.getElementById("msg").value = "";
  } else {
    alert("You can't post nothing, bruh.");
  }
};

const getExtension = filename => {
  const parts = filename.split(".");
  return parts[parts.length - 1];
};
const isImage = filename => {
  const ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case "jpg":
    case "gif":
    case "bmp":
    case "png":
    case "jpeg":
      return true;
  }
  return false;
};

const post = document.getElementById("post");
post.addEventListener("click", createPost, false);
