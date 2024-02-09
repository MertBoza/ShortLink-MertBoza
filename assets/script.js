let savedUrls = [];  //empty array to store the shortened urls

function saveUrlsToLocalStorage() {
    localStorage.setItem('savedUrls', JSON.stringify(savedUrls));
}   //function to save urls to local storage so they dont disappear when we refresh the page

function loadUrlsFromLocalStorage() {
    const savedUrlsString = localStorage.getItem('savedUrls');
    if (savedUrlsString) {
        savedUrls = JSON.parse(savedUrlsString);
    }
} //function to load the saved urls 

function addUrlToPage(urlData) {
    savedUrls.push(urlData);
    saveUrlsToLocalStorage();

    const urlList = document.getElementById('urlList');
    const urlContainer = document.createElement('div');
    
    const urlElement = document.createElement('a');
    urlElement.href = urlData.url;
    urlElement.textContent = urlData.shortenedUrl;
    urlElement.target = '_blank';
    urlContainer.appendChild(urlElement);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-primary buttonMargin'
    deleteButton.onclick = function() {
        const index = savedUrls.findIndex(item => item.shortenedUrl === urlData.shortenedUrl);
        if (index !== -1) {
            savedUrls.splice(index, 1);
            saveUrlsToLocalStorage();
            urlContainer.remove();
        }
    };
    urlContainer.appendChild(deleteButton);

    urlList.appendChild(urlContainer);
} //function to add the urls to page

function shortenUrl() {
    const originalUrl = document.getElementById('originalUrl').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    
    if (!originalUrl) {
        errorMessage.textContent = 'Please enter a URL to shorten.';
        return;
    } else {
        errorMessage.textContent = '';
    }

    const randomString = generateRandomString(5);
    const shortenedUrl = 'https://shorturl.com/' + randomString;

    const expirationSelect = document.getElementById('expiration');
    const expirationValue = parseInt(expirationSelect.value, 10);
    const expirationTime = Date.now() + expirationValue;

    const urlData = { url: originalUrl, shortenedUrl, expiration: expirationTime };
    addUrlToPage(urlData);
} //function to shorten the url

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomString;
} //function to generate random strings to have at the end of our base url

window.onload = function() {
    savedUrls.forEach(urlData => {
        const now = Date.now();
        if (now > urlData.expiration) {
            const index = savedUrls.findIndex(item => item.shortenedUrl === urlData.shortenedUrl);
            if (index !== -1) {
                savedUrls.splice(index, 1);
            }
        } else {
            addUrlToPage(urlData);
        }
    });
}; // function to execute all the code after the page has been fully loaded