import Notiflix from "notiflix";

import simpleLightbox from "simplelightbox";

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
loadMoreBtn.button.addEventListener("click", fetchNews);

function onSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;
  searchImages.searchQuery = form.elements.searchinfo.value.trim();
  clearNewsList();
  searchImages.resetPage();
  loadMoreBtn.show();

  fetchNews().finally(() => form.reset());
  
}

function fetchNews() {
  loadMoreBtn.disable();
  return searchImages
    .fetchImages()
    .then(({data }) => {
      if (data.length === 0) throw new Error("No data");

      return data.reduce(
        (markup, article) => createMarkup(article) + markup,
        ""
      );
    })
    .then((markup) => {
      updateNewsList(markup);
      loadMoreBtn.enable();
    })
    .catch(onError);
}





function createMarkup({webformatURL,largeImageURL,tags,likes,views,comments,downloads}) {
    return `
    <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${likes}</b>
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
    `
}

function clearNewsList() {
  caseImages.innerHTML = "";
}

function updateNewsList(markup) {
  caseImages.insertAdjacentHTML("beforeend", markup);
}
function onError(err) {
    console.error(err);
    updateNewsList("<p>Articles not found</p>");
    caseImages.innerHTML = ""
    Notiflix.Notify.failure("Sorry,there are no images matching your search query.Please try again")
  }