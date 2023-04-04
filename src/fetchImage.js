export function fetchImage(search) {
    const params = new URLSearchParams({
        apiKey: process.env.API_KEY,
        q: search,
        image_type: photo,
        orientation: horizontal,
        safesearch: true,
    })
    const url = 'https://pixabay.com/api/';
    return fetch(url)
}