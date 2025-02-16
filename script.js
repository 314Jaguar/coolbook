let quotes = [];
let users = [];
let currentUser = null;
let favoriteQuotes = [];
let darkMode = false;

function uploadQuote() {
    const quoteInput = document.getElementById('quote-input');
    const quoteText = quoteInput.value.trim();
    if (quoteText && currentUser) {
        const quote = {
            text: quoteText,
            user: currentUser.username,
            date: new Date().toISOString(),
            likes: 0,
            favorites: 0,
            comments: []
        };
        quotes.push(quote);
        quoteInput.value = '';
        displayQuotes();
    } else if (!currentUser) {
        alert("Please log in to upload a quote.");
    }
}

function displayQuotes() {
    const quotesList = document.getElementById('quotes-list');
    quotesList.innerHTML = '';
    quotes.forEach((quote, index) => {
        const quoteItem = document.createElement('div');
        quoteItem.className = 'quote-item';
        quoteItem.innerHTML = `
            <p>${quote.text}</p>
            <p><small>by ${quote.user} on ${new Date(quote.date).toLocaleString()}</small></p>
            <div class="actions">
                <button onclick="likeQuote(${index})">Like (${quote.likes})</button>
                <button onclick="favoriteQuote(${index})">Favorite (${quote.favorites})</button>
                <button onclick="commentQuote(${index})">Comment</button>
                <button onclick="shareQuote(${index})">Share</button>
            </div>
            <div class="comments">
               
