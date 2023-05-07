import './css/styles.css';
import axios from 'axios/dist/axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const input = document.querySelector('input[name="searchQuery"]');
const form = document.querySelector('.search-form');
let request = '';
let page = 1;

form.addEventListener('submit', handlerSearchImages);
btnLoadMore.addEventListener('click', handlerLoadMore);

var lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

async function handlerSearchImages(event) {
  event.preventDefault();
  btnLoadMore.classList.add('visually-hidden');
  request = input.value.trim();
  if (!request) {
    return;
  }
  page = 1;
  try {
    const data = await getImages(request, page);
    const images = data.hits;
    if (!images.length) {
      throw new Error();
    }
    const markupGallery = createMarkupGallery(images);
    gallery.innerHTML = markupGallery;
    lightbox.refresh();
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    btnLoadMore.classList.remove('visually-hidden');
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    gallery.innerHTML = '';
  }
}

async function getImages(request, page) {
  const response = await axios.get('https://pixabay.com/api/', {
    params: {
      key: '19455332-d5e97e52b6c9cba374c4e4b27',
      q: `${request}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: 40,
    },
  });
  const data = response.data;
  return data;
}

function createMarkupGallery(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
  <div class="photo-card">
  <a href="${largeImageURL}">
  <img class="photo-img" src="${
    webformatURL ||
    'https://liftlearning.com/wp-content/uploads/2020/09/default-image.png'
  }" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes || 'Not found'}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views || 'Not found'}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments || 'Not found'}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads || 'Not found'}
    </p>
  </div>
  </a>
</div>
`
    )
    .join('');
}

async function handlerLoadMore() {
  try {
    page += 1;
    const data = await getImages(request, page);
    const images = data.hits;
    const markupGallery = createMarkupGallery(images);
    gallery.insertAdjacentHTML('beforeend', markupGallery);
    lightbox.refresh();
    if (images.length < 40) {
      btnLoadMore.classList.add('visually-hidden');
      Notify.failure(
        'We`re sorry, but you`ve reached the end of search results.'
      );
    }
  } catch (error) {
    console.log(error);
    Notify.failure('Oops, something went wrong. Try again later.');
  }
}
