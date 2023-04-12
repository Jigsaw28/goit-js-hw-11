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

async function onSearch(e) {
  clearMarkup();
  e.preventDefault();
  imageApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  imageApiService.resetPage();
  if (imageApiService.query === '') {
    Notiflix.Notify.info('Enter something');
  } else {
    const newCard = await imageApiService.fetchImage();
    const { hits, totalHits } = newCard;
    try {
      if (hits.length === 0) {
        return error;
      }
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      appendMarkup(hits);
      btnLoadMore.classList.remove('is-hidden');
    } catch (error) {
      btnLoadMore.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  }
}

async function onLoadMore() {
  try {
    const newCard = await imageApiService.fetchImage();
    const { hits, totalHits } = newCard;
    const totalPage = totalHits / imageApiService.perPage;
    if (imageApiService.page > totalPage) {
      return error;
    }
    appendMarkup(hits);
  } catch (error) {
    btnLoadMore.classList.add('is-hidden');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
  }
}

function appendMarkup(card) {
  cardsEl.insertAdjacentHTML('beforeend', renderCards(card));
  lightbox.refresh();
}

function renderCards(card) {
  return card
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

