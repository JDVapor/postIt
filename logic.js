let commentCount = 1;

const getComment = () => {
  const msg = document.getElementById("msg").value;
  if (msg.trim() !== "") {
    const result = document.getElementById("result");

    const post = document.createElement("div");
    const heading = document.createElement("h2");
    const comment = document.createElement("p");

    post.className = "postBox w-third pa3 tl";
    post.id = `postBox${commentCount}`;
    heading.className = "heading tl";
    heading.id = `heading${commentCount}`;
    comment.className = "comment";
    comment.id = `comment${commentCount}`;

    const title = document.createTextNode(`Post #${commentCount}`);
    const content = document.createTextNode(msg);

    heading.appendChild(title);
    comment.appendChild(content);
    post.appendChild(comment);
    comment.before(heading);
    result.appendChild(post);

    commentCount++;
    document.getElementById('msg').value = '';
  } else {
    alert("You can't post nothing, bruh.");
  }
};

const post = document.getElementById("post");
post.addEventListener("click", getComment, false);
