const formEl = document.querySelector(".search-form");

const API_KEY = '35061241-cc64e28d246336ea3caedb193';
const URL = 'https://pixabay.com/api/?';

formEl.addEventListener("submit", onSubmit);

function onSubmit(e) {
    e.preventDefault();
    const searchQuery = e.currentTarget.elements.searchQuery.value.trim();
    if (!searchQuery) {
        return;
    }
    fetchImage(searchQuery)
        .then((response) => renderImageMarkup(response))
        .catch((error) => console.log(error));
    
    e.currentTarget.reset()
}

function fetchImage(searchImages) {
    const params = new URLSearchParams({
        key: API_KEY,
        q: searchImages,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
    })
    const url = `${URL}${params.toString()} `;
    return fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log(error);
    })
}