import './css/styles.css';
import axios from 'axios/dist/axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const input = document.querySelector('input[name="searchQuery"]');
const form = document.querySelector('.search-form');
let request = '';
let page = 1;

form.addEventListener('submit', handlerSearchImages);
btnLoadMore.addEventListener('click', handlerLoadMore);

async function handlerSearchImages(event) {
  event.preventDefault();
  btnLoadMore.classList.add('visually-hidden');
  request = input.value;
  if (!request) {
    return;
  }
  page = 1;
  // event.currentTarget.reset();
  try {
    const images = await getImages(request, page);
    if (!images.length) {
      throw new Error();
    }
    const markupGallery = createMarkupGallery(images);
    gallery.innerHTML = markupGallery;

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
  const images = response.data.hits;
  return images;
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
</div>
`
    )
    .join('');
}

async function handlerLoadMore() {
  const per_page = 40;
  const totalPages = Math.floor(500 / per_page);
  try {
    page += 1;
    const images = await getImages(request, page);
    if (page > totalPages) {
      throw new Error();
    }
    const markupGallery = createMarkupGallery(images);
    gallery.insertAdjacentHTML('beforeend', markupGallery);
  } catch (error) {
    btnLoadMore.classList.add('visually-hidden');
    Notify.failure(
      'We`re sorry, but you`ve reached the end of search results.'
    );
  }
}
