const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const newQuoteBtn = document.getElementById("new-quote");
const copyBtn = document.getElementById("copy-btn");
const tweetBtn = document.getElementById("tweet-btn");

let quotes = []; // store fetched quotes
let currentQuote = null;

const colors = ["#ffd369", "#80ed99", "#00b4d8", "#f77f00", "#e0aaff"];

function typeText(element, text, callback) {
  element.textContent = "";
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    if (i === text.length) {
      clearInterval(interval);
      callback?.();
    }
  }, 30);
}

function showQuote() {
  if (quotes.length === 0) return;

  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  currentQuote = quote;

  // Animate fade-out
  quoteText.classList.remove("show");

  // Color update
  const color = colors[Math.floor(Math.random() * colors.length)];
  document.querySelector(".container").style.borderColor = color;
  document.querySelector("h1").style.color = color;

  setTimeout(() => {
    typeText(quoteText, `"${quote.text}"`, () => {
      quoteText.classList.add("show");
    });
    authorText.textContent = quote.author || "Unknown";
  }, 300);
}

async function fetchQuotes() {
  try {
    const res = await fetch('https://api.api-ninjas.com/v1/quotes');
    quotes = await res.json();
    showQuote();
  } catch (err) {
    quoteText.textContent = "⚠️ Couldn't load quotes.";
    authorText.textContent = "Network/API Error";
    console.error("Fetch error:", err);
  }
}

copyBtn.addEventListener("click", () => {
  if (!currentQuote) return;
  const text = `"${currentQuote.text}" — ${currentQuote.author || "Unknown"}`;
  navigator.clipboard.writeText(text).then(() => {
    alert("Quote copied to clipboard!");
  });
});

tweetBtn.addEventListener("click", () => {
  if (!currentQuote) return;
  const tweet = `"${currentQuote.text}" — ${currentQuote.author || "Unknown"}`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
  window.open(url, "_blank");
});

newQuoteBtn.addEventListener("click", showQuote);

// Load quotes on page load
fetchQuotes();
