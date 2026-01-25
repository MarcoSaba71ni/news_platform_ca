import { postArticle } from "../api/articles.js";

const form = document.getElementById("create-article-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;
  const category = document.getElementById("category").value;   
  const imageUrl = document.getElementById("media_url").value;
  const imageAlt = document.getElementById("media_alt").value;

  const articleData = {
    title,
    body,
    category,
    media_url: imageUrl,
    media_alt: imageAlt,
  };

  try {
    await postArticle(articleData);
    alert("Article created successfully!");
    window.location.href = "./index.html";
  } catch (error) {
    console.error(error);
    alert("Failed to create article.");
  }
});
