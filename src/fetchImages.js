import axios from 'axios';

export default class SearchImages {
  constructor() {
    this.queryPage = 1;
    this.searchQuery = '';
  }
  async fetchImages() {
    const API_URL = 'https://pixabay.com/api/';
    const API_KEY = '33324048-b9ba4b7c70cb9631c17379677';
    const response = await axios.get(
      `${API_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.queryPage}`
    );
    this.incrementPage();
    return response;
  }
  resetPage() {
    this.queryPage = 1;
  }
  incrementPage() {
    this.queryPage += 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
