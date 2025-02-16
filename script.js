let quotes = [];

function uploadQuote() {
    const quoteInput = document.getElementById('quote-input');
    const quoteText = quoteInput.value.trim();
    if (quoteText) {
        quotes.push(quoteText);
        quoteInput.value = '';
        displayQuotes();
    }
}

function displayQuotes() {
    const quotesList = document.getElementById('quotes-list');
    quotesList.innerHTML = '';
    quotes.forEach((quote, index) => {
        const quoteItem = document.createElement('div');
        quoteItem.className = 'quote-item';
        quoteItem.innerHTML = `
            <p>${quote}</p>
            <div class="actions">
                <button onclick="likeQuote(${index})">Like</button>
                <button onclick="shareQuote(${index})">Share</button>
            </div>
        `;
        quotesList.appendChild(quoteItem);
    });
}

function searchQuotes() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filteredQuotes = quotes.filter(quote => quote.toLowerCase().includes(searchInput));
    const quotesList = document.getElementById('quotes-list');
    quotesList.innerHTML = '';
    filteredQuotes.forEach((quote, index) => {
        const quoteItem = document.createElement('div');
        quoteItem.className = 'quote-item';
        quoteItem.innerHTML = `
            <p>${quote}</p>
            <div class="actions">
                <button onclick="likeQuote(${index})">Like</button>
                <button onclick="shareQuote(${index})">Share</button>
            </div>
        `;
        quotesList.appendChild(quoteItem);
    });
}

function likeQuote(index) {
    alert(`You liked the quote: "${quotes[index]}"`);
}

function shareQuote(index) {
    const quote = quotes[index];
    const shareData = {
        title: 'Quote',
        text: quote,
        url: window.location.href,
    };
    navigator.share(shareData).then(() => {
        alert('Quote shared successfully');
    }).catch((error) => {
        alert('Error sharing quote: ' + error);
    });
}
