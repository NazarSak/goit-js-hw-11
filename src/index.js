import Notiflix from "notiflix";

import SimpleLightbox from "simplelightbox";

import SearchImages from "./fetchImages";

import LoadMoreBtn from "./components/LoadMoreBtn";

//  all imports

const submitBut = document.querySelector(".submit-button");

const input = document.querySelector(".input")

const caseImages = document.querySelector(".gallery");

const form = document.querySelector(".search-form");


// all HTML elements

const searchImages =  new  SearchImages();

const loadMoreBtn = new LoadMoreBtn({
  selector: "#loadMoreBtn",
  isHidden: true,
});



form.addEventListener("submit",onSubmit)
loadMoreBtn.button.addEventListener("click", fetchMoreImages);

function onSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;
  searchImages.searchQuery = form.elements.searchinfo.value.trim();
 
  clearNewsList()
  searchImages.resetPage();
  loadMoreBtn.show();



  fetchMoreImages()
}

 async function fetchMoreImages() {
  loadMoreBtn.disable();
try {
const newSearch = await searchImages.fetchImages()

if (newSearch.data.hits.length === 0) {
  Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
  loadMoreBtn.hide();
}

else if (newSearch.data.hits.length  < 40) {
  createMarkup(newSearch.data);
  loadMoreBtn.hide();
  Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
}
 else {
  createMarkup(newSearch.data)
  loadMoreBtn.enable();
 }


  
} catch (err) {
  onError(err)
} finally {
  form.reset()
}
  
  
   
}





function createMarkup({hits}) {
    const markup = hits.map(({webformatURL,largeImageURL,tags,likes,views,comments,downloads}) => `
    <div class="photo-card">
    <a class = "gallery-item" href = "${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes:</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>${views}</b>
    </p>
    <p class="info-item">
      <b>${comments}</b>
    </p>
    <p class="info-item">
      <b>${downloads}</b>
    </p>
  </div>
</div>
    `).join("");
    caseImages.insertAdjacentHTML("beforeend",markup) 
    gallery.refresh()
}

function clearNewsList() {
  caseImages.innerHTML = "";
}

// function scroll() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }

function onError(err) {
    console.error(err);
    clearNewsList()
    Notiflix.Notify.failure("Sorry,there are no images matching your search query.Please try again")
  }

  
  const gallery = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: "alt",
    captionDelay: 250,
  });
   