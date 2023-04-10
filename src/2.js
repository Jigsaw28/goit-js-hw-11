import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImageApiService from './fetchImage';

const formEl = document.querySelector('.search-form');
const cardsEl = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const imageApiService = new ImageApiService();

formEl.addEventListener('submit', onSearch);
btnLoadMore.addEventListener('click', onLoadMore);

function onSearch(e) {
  clearMarkup();
  e.preventDefault();
  imageApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  imageApiService.resetPage();
  if (imageApiService.query === '') {
    Notiflix.Notify.info('Enter something');
  } else {
    imageApiService.fetchImage().then(({ hits, totalHits }) => {
      if (hits.length === 0) {
        btnLoadMore.classList.add('is-hidden');
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        appendMarkup(hits);
        btnLoadMore.classList.remove('is-hidden');
      }
    });
  }
}

function onLoadMore() {
  imageApiService.fetchImage().then(({ hits, totalHits }) => {
    const totalPage = totalHits / imageApiService.perPage;
    if (imageApiService.page > totalPage) {
      btnLoadMore.classList.add('is-hidden');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    appendMarkup(hits);
  });
}

function appendMarkup(hits) {
  cardsEl.insertAdjacentHTML('beforeend', renderCards(hits));
  lightbox.refresh();
}

function renderCards(hits) {
  return hits
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
    <b>Likes:${likes}</b>
  </p>
  <p class="info-item">
    <b>Views:${views}</b>
  </p>
  <p class="info-item">
    <b>Comments:${comments}</b>
  </p>
  <p class="info-item">
    <b>Downloads:${downloads}</b>
  </p>
</div>
</div>`;
      }
    )
    .join('');
}

function clearMarkup() {
  cardsEl.innerHTML = '';
}
const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});
