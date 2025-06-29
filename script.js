const quoteText = document.getElementById("quote");
const newQuoteBtn = document.getElementById("new-quote");
const copyBtn = document.getElementById("copy-btn");
const tweetBtn = document.getElementById("tweet-btn");
const loader = document.getElementById("loader");
const quoteBox = document.getElementById("quote-box");

let currentQuote = null;

const colors = ["#ffd369", "#80ed99", "#00b4d8", "#f77f00", "#e0aaff"];

function typeText(element, fullText, callback) {
  element.textContent = "";
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += fullText.charAt(i);
    i++;
    if (i === fullText.length) {
      clearInterval(interval);
      callback?.();
    }
  }, 10); // Fast typing
}

function showLoader() {
  loader.style.display = "block";
  quoteBox.style.display = "none";
}

function hideLoader() {
  loader.style.display = "none";
  quoteBox.style.display = "flex";
}

async function fetchQuote() {
  quoteText.classList.remove("show");
  showLoader();

  try {
    const res = await fetch("https://random-quotes-freeapi.vercel.app/api/random");
    const data = await res.json();

    const quote = data.quote;
    const author = data.author || "Unknown";
    currentQuote = { text: quote, author: author };

    const fullText = `"${quote}"\n\n~ ${author}`;
    const color = colors[Math.floor(Math.random() * colors.length)];

    document.querySelector(".container").style.borderColor = color;
    document.querySelector("h1").style.color = color;

    setTimeout(() => {
      typeText(quoteText, fullText, () => {
        quoteText.classList.add("show");
      });
      hideLoader();
    }, 200); // Faster load
  } catch (error) {
    quoteText.textContent = "⚠️ Could not load quote.";
    hideLoader();
    console.error("Error fetching quote:", error);
  }
}

newQuoteBtn.addEventListener("click", fetchQuote);

copyBtn.addEventListener("click", () => {
  if (!currentQuote) return;
  const text = `"${currentQuote.text}" — ${currentQuote.author}`;
  navigator.clipboard.writeText(text).then(() => {
    alert("✅ Quote copied!");
  });
});

tweetBtn.addEventListener("click", () => {
  if (!currentQuote) return;
  const tweet = `"${currentQuote.text}" — ${currentQuote.author}`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
  window.open(url, "_blank");
});

// Load on page start
fetchQuote();

// Auto-refresh every 15s
setInterval(fetchQuote, 15000);
