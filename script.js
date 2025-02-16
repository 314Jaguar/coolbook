let quotes = [];
let currentUser = 'Anonymous';
let favoriteQuotes = [];
let currentQuoteIndex = null;

function uploadQuote() {
    const quoteInput = document.getElementById('quote-input');
    const tagsInput = document.getElementById('tags-input');
    const quoteText = quoteInput.value.trim();
    const tags = tagsInput.value.trim().split(',').map(tag => tag.trim()).filter(tag => tag);

    if (quoteText) {
        const quote = {
            text: quoteText,
            user: currentUser,
            date: new Date().toISOString(),
            likes: 0,
            favorites: 0,
            comments: [],
            tags: tags
        };
        quotes.push(quote);
        quoteInput.value = '';
        tagsInput.value = '';
        updateTagSelect();
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
            <p>${quote.text}</p>
            <p><small>by <span onclick="showUserProfile('${quote.user}')" class="user-link">${quote.user}</span> on ${new Date(quote.date).toLocaleString()}</small></p>
            <p><small>Tags: ${quote.tags.join(', ')}</small></p>
            <div class="actions">
                <button onclick="likeQuote(${index})">Like (${quote.likes})</button>
                <button onclick="favoriteQuote(${index})">Favorite (${quote.favorites})</button>
                <button onclick="commentQuote(${index})">Comment</button>
                <button onclick="shareQuote(${index})">Share</button>
                <button onclick="downloadQuote(${index})">Download</button>
            </div>
            <div class="comments">
                <ul id="comments-list-${index}">
                    ${quote.comments.map(comment => `<li>${comment}</li>`).join('')}
                </ul>
            </div>
        `;
        quotesList.appendChild(quoteItem);
    });
}

function searchQuotes() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filteredQuotes = quotes.filter(quote => quote.text.toLowerCase().includes(searchInput));
    displayFilteredQuotes(filteredQuotes);
}

function displayFilteredQuotes(filteredQuotes) {
    const quotesList = document.getElementById('quotes-list');
    quotesList.innerHTML = '';
    filteredQuotes.forEach((quote, index) => {
        const quoteItem = document.createElement('div');
        quoteItem.className = 'quote-item';
        quoteItem.innerHTML = `
            <p>${quote.text}</p>
            <p><small>by <span onclick="showUserProfile('${quote.user}')" class="user-link">${quote.user}</span> on ${new Date(quote.date).toLocaleString()}</small></p>
            <p><small>Tags: ${quote.tags.join(', ')}</small></p>
            <div class="actions">
                <button onclick="likeQuote(${index})">Like (${quote.likes})</button>
                <button onclick="favoriteQuote(${index})">Favorite (${quote.favorites})</button>
                <button onclick="commentQuote(${index})">Comment</button>
                <button onclick="shareQuote(${index})">Share</button>
                <button onclick="downloadQuote(${index})">Download</button>
            </div>
            <div class="comments">
                <ul id="comments-list-${index}">
                    ${quote.comments.map(comment => `<li>${comment}</li>`).join('')}
                </ul>
            </div>
        `;
        quotesList.appendChild(quoteItem);
    });
}

function updateTagSelect() {
    const tagSelect = document.getElementById('tag-select');
    const tags = [...new Set(quotes.flatMap(quote => quote.tags))];
    tagSelect.innerHTML = '<option value="">Filter by Tag</option>';
    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagSelect.appendChild(option);
    });
}

function likeQuote(index) {
    quotes[index].likes++;
    displayQuotes();
}

function favoriteQuote(index) {
    quotes[index].favorites++;
    displayQuotes();
}

function commentQuote(index) {
    currentQuoteIndex = index;
    document.getElementById('comments-modal').style.display = 'block';
}

function addComment() {
    const commentInput = document.getElementById('comment-input');
    const commentText = commentInput.value.trim();
    if (commentText) {
        quotes[currentQuoteIndex].comments.push(commentText);
        commentInput.value = '';
        displayQuotes();
        closeModal('comments-modal');
    }
}

function shareQuote(index) {
    const quote = quotes[index];
    const shareData = {
        title: 'Quote',
        text: quote.text,
        url: window.location.href,
    };
    navigator.share(shareData).then(() => {
        alert('Quote shared successfully');
    }).catch((error) => {
        alert('Error sharing quote: ' + error);
    });
}

function downloadQuote(index) {
    const quote = quotes[index];
    const blob = new Blob([quote.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quote.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function showUserProfile(username) {
    const userQuotes = quotes.filter(quote => quote.user === username);
    const profileQuotesList = document.getElementById('profile-quotes');
    profileQuotesList.innerHTML = '';
    userQuotes.forEach((quote, index) => {
        const quoteItem = document.createElement('div');
        quoteItem.className = 'quote-item';
        quoteItem.innerHTML = `
            <p>${quote.text}</p>
            <p><small>by ${quote.user} on ${new Date(quote.date).toLocaleString()}</small></p>
            <p><small>Tags: ${quote.tags.join(', ')}</small></p>
            <div class="actions">
                <button onclick="likeQuote(${index})">Like (${quote.likes})</button>
                <button onclick="favoriteQuote(${index})">Favorite (${quote.favorites})</button>
                <button onclick="commentQuote(${index})">Comment</button>
                <button onclick="shareQuote(${index})">Share</button>
                <button onclick="downloadQuote(${index})">Download</button>
            </div>
            <div class="comments">
                <ul id="comments-list-${index}">
                    ${quote.comments.map(comment => `<li>${comment}</li>`).join('')}
                </ul>
            </div>
        `;
        profileQuotesList.appendChild(quoteItem);
    });
    document.getElementById('profile-modal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showTopQuotes() {
    const topQuotes = quotes
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5);
    displayFilteredQuotes(topQuotes);
}

function filterByTag() {
    const tagSelect = document.getElementById('tag-select');
    const selectedTag = tagSelect.value;
    if (selectedTag) {
        const filteredQuotes = quotes.filter(quote => quote.tags.includes(selectedTag));
        displayFilteredQuotes(filteredQuotes);
    } else {
        displayQuotes();
    }
}

function displayQuoteOfTheDay() {
    const quoteOfTheDay = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote-of-the-day').innerHTML = `
        <h2>Quote of the Day</h2>
        <p>${quoteOfTheDay.text}</p>
        <p><small>by ${quoteOfTheDay.user} on ${new Date(quoteOfTheDay.date).toLocaleString()}</small></p>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    displayQuoteOfTheDay();
    updateTagSelect();
});
