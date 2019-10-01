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
posts.once("value", function(snapshot) {
  const res = snapshot.val();
  const content = Object.values(res);

  content.map((data, index) => {
    const body = data.body;

    const result = document.getElementById("result");
    const container = document.createElement("div");
    const heading = document.createElement("h2");
    const comment = document.createElement("p");

    container.className = "postBox w-third pa3 tl";
    container.id = `postBox${index + 1}`;
    heading.className = "heading tl";
    heading.id = `heading${index + 1}`;
    comment.className = "comment";
    comment.id = `comment${index + 1}`;

    const title = document.createTextNode(`Post #${index + 1}`);
    const post = document.createTextNode(body);

    heading.appendChild(title);
    comment.appendChild(post);
    container.appendChild(comment);
    comment.before(heading);
    result.appendChild(container);
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

      const result = document.getElementById("result");
      const container = document.createElement("div");
      const heading = document.createElement("h2");
      const comment = document.createElement("p");

      container.className = "postBox w-third pa3 tl";
      container.id = `postBox${postCt}`;
      heading.className = "heading tl";
      heading.id = `heading${postCt}`;
      comment.className = "comment";
      comment.id = `comment${postCt}`;

      const title = document.createTextNode(`Post #${postCt}`);
      const post = document.createTextNode(msg);
      heading.appendChild(title);
      comment.appendChild(post);
      container.appendChild(comment);
      comment.before(heading);
      result.appendChild(container);
      document.getElementById("msg").value = "";
    });
  } else {
    alert("You can't post nothing, bruh.");
  }
};

const post = document.getElementById("post");
post.addEventListener("click", getComment, false);
