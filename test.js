const getComment = () => {
  const msg = document.getElementById("msg").value;
  // if (msg.trim() !== "") {
    // posts.once("value", function(snapshot) {
    //   const res = snapshot.val();
    //   const content = Object.values(res);
    //   const postCt = content.length + 1;
    //   posts.push({ postNum: postCt, body: msg });

      const result = document.getElementById("result");
      const container = document.createElement("div");
      const heading = document.createElement("h2");
      const comment = document.createElement("p");

      container.className = "postBox w-third pa3 tl";
      container.id = `postBox`;
      heading.className = "heading tl";
      heading.id = `heading`;
      comment.className = "comment";
      comment.id = `comment`;

      const title = document.createTextNode(`Post #`);
      let input = msg;
      if (msg.substring(0, 4) === "pic:") {
        input = document.createElement("img");
        input.src = msg.substring(4);
      } else {
        input = document.createTextNode(msg);
      }

      heading.appendChild(title);
      comment.appendChild(input);
      container.appendChild(comment);
      comment.before(heading);
      result.appendChild(container);
      document.getElementById("msg").value = "";
  // } else {
  //   alert("You can't post nothing, bruh.");
  // }
};

const post = document.getElementById("post");
post.addEventListener("click", getComment, false);
