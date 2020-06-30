const gallery = document.getElementById('gallery');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('search-form');
const more = document.getElementById('more');
const title = document.getElementById('title');
const loader = document.getElementById('loader');
let searchValue;
let page = 1;
let fetchLink;
let imagesLoaded = 0;
more.hidden = true;

//event listener
searchInput.addEventListener('input', updateInput);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  getPhotos(searchValue);
})

more.addEventListener('click', loadMore)

function updateInput(e) {
  searchValue = e.target.value;
}

//api
const apiKey = "jFgS8tteGD425f4oZfygQVaVnD6gt6GucN2yyz3xFek";

function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

function imageReady() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    loader.hidden = true;
    title.innerHTML = `Results of ${searchValue.toUpperCase()}`
  }
}

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });
  const data = await dataFetch.json();
  return data;
}

function generatePictures(data) {
  imagesLoaded = 0;
  totalImages = data.results.length;

  console.log(data)
  data.results.forEach((photo) => {
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.cover_photo.links.html,
      target: "_blank"
    });
    const image = document.createElement('img');
    setAttributes(image, {
      src: photo.cover_photo.urls.thumb,
      alt: photo.cover_photo.alt_description,
      title: photo.cover_photo.description,
    });
    image.addEventListener('load', imageReady);
    item.appendChild(image);
    gallery.appendChild(item);
  });
}

async function getPhotos() {
  clear();
  fetchLink = `https://api.unsplash.com/search/collections/?client_id=${apiKey}&query=${searchValue}&per_page=30`
  const data = await fetchApi(fetchLink);

  generatePictures(data);
  more.hidden = false;
}

function clear() {
  gallery.innerHTML = '';
  searchInput.value = '';
}

async function loadMore() {
  page++;
  fetchLink = `https://api.unsplash.com/search/collections/?client_id=${apiKey}&query=${searchValue}&per_page=15&page=${page}`;

  const data = await fetchApi(fetchLink)
  generatePictures(data);
}