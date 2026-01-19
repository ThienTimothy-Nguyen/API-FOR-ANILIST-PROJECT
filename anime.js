const animeContainer = document.querySelector(".anime__container");
const url = "https://graphql.anilist.co";
const searchText = localStorage.getItem("searchText");
if (searchText) {
  localStorage.removeItem("searchText")
}

const query1 = `
  query ($search: String) {
    Page(page: 1, perPage: 20) {
      media(type: ANIME, search: $search, genre_not_in: ["Hentai", "Ecchi"], sort: POPULARITY_DESC) {
        id
        title { romaji english userPreferred }
        coverImage { large }
        genres
        averageScore
        episodes
        seasonYear
      }
    }
  }`;

const query2 = `
  query {
    Page(page: 1, perPage: 50) {
      media(type: ANIME, genre_not_in: ["Hentai", "Ecchi"],sort: TRENDING_DESC) {
        id
        title { romaji english userPreferred }
        coverImage { large }
        genres
        averageScore
        episodes
        seasonYear
      }
    }
  }`;

// json

async function fetchAniList(query, variables = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

function renderAnimeList(list) {
  animeContainer.innerHTML = list.map(animeShow).join("");
}

function animeShow(show) {
  const title =
    show.title.userPreferred ||
    show.title.english ||
    show.title.romaji ||
    "Unknown";

  return `
    <div class="anime__show">
      <figure class="anime__img--wrapper">
        <img class="anime__img" src="${show.coverImage.large}" alt="${title}">
        <div class="anime__img--overlay"><i class="fa-regular fa-circle-play"></i></div>
      </figure>
      <div class="anime__show--description">
        <h3 class="anime__show--title">${title}</h3>
        <h4 class="anime__show--info">Genres: ${show.genres.join(", ")}</h4>
        <h4 class="anime__show--info">Average Score: ${show.averageScore || "???"}</h4>
        <h4 class="anime__show--info">Episodes: ${show.episodes || "???"}</h4>
        <h4 class="anime__show--info">Year Released: ${show.seasonYear || "???"}</h4>
      </div>
    </div>
  `;
}

// Submit Form

async function searchAnime(event) {
  event.preventDefault();

  const input = document.getElementById("input");

  const searchTerm = input.value.trim();

  if (!searchTerm) return;
    try {
      emptyContainer()
      pageLoading()
      searchResult()
      document.querySelector('.search__key').innerHTML = `${searchTerm}`;
      const data = await fetchAniList(query1, { search: searchTerm });
      const list = data.data.Page.media;
      pageLoadingRemove();
      renderAnimeList(list)}
    catch (err) {
      console.error("AniList error:", err);}
}

// Page Load

(async function loadTrending() {
  if(searchText) {
    try {
      searchResult()
      pageLoading()
      document.querySelector('.search__key').innerHTML = `${searchText}`
      const data = await fetchAniList(query1, { search: searchText });
      const list = data.data.Page.media;
      pageLoadingRemove()
      renderAnimeList(list);
    } catch (err) {
      console.error("AniList error:", err);
    }
  }
  else {
    try {
      pageLoading()
      document.querySelector('.search__result').innerHTML = 'POPULAR SHOWS';
      const data = await fetchAniList(query2);
      pageLoadingRemove()
      renderAnimeList(data.data.Page.media);} 
    catch (err) {
      console.error("AniList error:", err);}
  }
})();

function searchResult() {
  document.querySelector('.search__result').innerHTML = `Search results: <span class="search__key purple"></span>`;
}

function pageLoading() {
  document.querySelector('.anime__container').classList.add('anime__loading')
}

function pageLoadingRemove() {
  document.querySelector('.anime__container').classList.remove('anime__loading')
}

function emptyContainer() {
  document.querySelector('.anime__container').innerHTML = '<i class="fa-solid fa-spinner anime__loading--spinner"></i>';
}




