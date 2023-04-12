import axios from "axios";

const API_KEY = '34776135-c2da03be0c2ba8614e7d82d4c';
const URL = 'https://pixabay.com/api/';

export default class ImageApiService {
  constructor() {
    this.searchQuerry = '';
    this.page = 1;
    this.perPage = 40;
  }

  async fetchImage() {
    const url = `${URL}?key=${API_KEY}&q=${this.searchQuerry}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`;
    const response = await axios(url);
    const cards = await response.data;
    this.page += 1;
    return cards;

    //     const url = `${URL}?key=${API_KEY}&q=${this.searchQuerry}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`;
    // return fetch(url)
    //   .then(response => response.json())
    //   .then((data) => {
    //       this.page += 1;
    //       return data;
    //   });
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuerry;
  }

  set query(newQuery) {
    this.searchQuerry = newQuery;
  }
}
