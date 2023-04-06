import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const formEl = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnLoadEl = document.querySelector('.load-more');

let pageNumber = 1;
const perPage = 40;

const API_KEY = '35061241-cc64e28d246336ea3caedb193';
const URL = 'https://pixabay.com/api/?';

formEl.addEventListener('submit', onSubmit);
btnLoadEl.addEventListener('click', onLoadMore);
btnLoadEl.classList.add('visually-hidden');



function onSubmit(e) {
  e.preventDefault();
  resetMarkup();
  resetPage();
  const searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  fetchImage(searchQuery)
    .then(response => {
      if (response.total === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else if (searchQuery === '') {
        Notiflix.Notify.info('Enter something');
      } else {
        renderImageMarkup(response);
        btnLoadEl.classList.remove('visually-hidden');
        pageNumber += 1;
        Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`)
      }
    })
    .catch(error => console.log(error));

  e.currentTarget.reset();
}

function renderImageMarkup(images) {
  const markup = images.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <a class='gallery__link' href='${largeImageURL}'><img class='gallery__image' src="${webformatURL}" alt="${tags}" loading="lazy" width='360' height='260'/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  galleryLightBox.refresh();
}

function fetchImage(searchImages) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: searchImages,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: pageNumber,
    per_page: perPage,
  });
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
    });
}

function onLoadMore() {
  const searchQuery = formEl.elements.searchQuery.value.trim();
  fetchImage(searchQuery)
    .then((response) => {
      const totalPage = response.totalHits / perPage;
      if (pageNumber > totalPage) {
        btnLoadEl.classList.add('visually-hidden');
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
      renderImageMarkup(response);
      pageNumber += 1;
      
    })
    .catch((error) => console.log(error));
}

function resetMarkup() {
  gallery.innerHTML = '';
}

function resetPage() {
  pageNumber = 1;
}

const galleryLightBox = new SimpleLightbox(".gallery__link", {
  captionDelay: 250,
});

