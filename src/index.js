import Notiflix from 'notiflix';

const formEl = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnLoadEl = document.querySelector('.load-more');

let pageNumber = 1;
const perPage = 40;
let isAlertVisible = false;

const API_KEY = '35061241-cc64e28d246336ea3caedb193';
const URL = 'https://pixabay.com/api/?';

formEl.addEventListener('submit', onSubmit);
btnLoadEl.addEventListener('click', onLoadMore);
btnLoadEl.classList.add('visually-hidden');

function onSubmit(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  const searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  if (!searchQuery) {
    return Notiflix.Notify.info('Enter something');
  }
  fetchImage(searchQuery)
    .then(response => {
        renderImages(response);
        btnLoadEl.classList.remove('visually-hidden');
      // pageNumber += 1;
      // if (pageNumber > 1) {
      //     btnLoadEl.classList.remove('visually-hidden');
      // }
    })
    .catch(error => console.log(error));

  e.currentTarget.reset();
}

function onLoadMore() {
    const searchQuery = formEl.elements.searchQuery.value.trim();
//   const totalPages = 500 / perPage;
//   if (pageNumber > totalPages) {
//       btnLoadEl.classList.add('visually-hidden');
//       Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
//   }
  fetchImage(searchQuery)
    .then(response => {
      renderImages(response);
      pageNumber += 1;
      if (pageNumber > 1) {
        btnLoadEl.classList.remove('visually-hidden');
      }
    })
    .catch(error => console.log(error));
}

function renderImageMarkup(images) {
  return images.hits
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
}

function renderImages(images) {
    const totalPages = images.totalHits / perPage;  
  if (images.total === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else if (pageNumber > totalPages) { 
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
      btnLoadEl.classList.add('visually-hidden');
  } else {
    gallery.insertAdjacentHTML('beforeend', renderImageMarkup(images));
  }
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
