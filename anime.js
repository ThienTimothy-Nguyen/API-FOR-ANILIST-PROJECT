const animeContainer = document.querySelector(".anime__container");
const url = "https://graphql.anilist.co";
const searchText = localStorage.getItem("searchText");
if (searchText) {
  localStorage.removeItem("searchText")
}

const query1 = `
  query ($search: String) {
    Page(page: 1, perPage: 10) {
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
        <i class="fa-regular fa-circle-play"></i>
        <div class="anime__img--overlay"></div>
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
      emptySearchResult()
      pageLoading()
      const data = await fetchAniList(query1, { search: searchTerm });
      const list = data.data.Page.media;
      setTimeout(() => {
        searchResult()
        document.querySelector('.search__key').innerHTML = `"${searchTerm}"`;
        pageLoadingRemove()
        renderAnimeList(list);
      }, 1000)
      async function filterAnime(event) {
  const data = await fetchAniList(query2);
    const list = data.data.Page.media;
  if (event.target.value === "average_score") {
    const listByScore = list.sort((a,b) => b.averageScore - a.averageScore)
    renderAnimeList(listByScore)
  }
  else if (event.target.value === "low_to_high") {
    const listByYear1 = list.sort((a,b) => a.seasonYear - b.seasonYear)
    renderAnimeList(listByYear1)
  }
  else if (event.target.value === "high_to_low") {
    const listByYear2 = list.sort((a,b) => b.seasonYear - a.seasonYear)
    renderAnimeList(listByYear2)
  }
}
    }
    catch (err) {
      console.error("AniList error:", err);}
}

// Page Load

(async function loadTrending() {
  if(searchText) {
    try {
      pageLoading()
      const data = await fetchAniList(query1, { search: searchText });
      const list = data.data.Page.media;
      setTimeout(() => {
        searchResult()
        document.querySelector('.search__key').innerHTML = `${searchText}`;
        pageLoadingRemove()
        renderAnimeList(list);
      }, 1000)
      
    } catch (err) {
      console.error("AniList error:", err);
    }
  }
  else {
    try {
      pageLoading()
      const data = await fetchAniList(query2);
      const list = data.data.Page.media;
      setTimeout(() => {
        document.querySelector('.search__result').innerHTML = 'POPULAR SHOWS';
        document.querySelector('.filter__container').innerHTML = 
        `<select name="" id="filter" onchange="filterAnime(event)">
            <option value="" disabled selected>Sort</option>
            <option value="average_score">Average score</option>
            <option value="low_to_high">Earlier released</option>
            <option value="high_to_low">Latest released</option>
        </select>`;
        pageLoadingRemove()
        renderAnimeList(list);
      }, 1000)} 
    catch (err) {
      console.error("AniList error:", err);}
  }
})();

async function filterAnime(event) {
  const data = await fetchAniList(query2);
    const list = data.data.Page.media;
  if (event.target.value === "average_score") {
    const listByScore = list.sort((a,b) => b.averageScore - a.averageScore)
    renderAnimeList(listByScore)
  }
  else if (event.target.value === "low_to_high") {
    const listByYear1 = list.sort((a,b) => a.seasonYear - b.seasonYear)
    renderAnimeList(listByYear1)
  }
  else if (event.target.value === "high_to_low") {
    const listByYear2 = list.sort((a,b) => b.seasonYear - a.seasonYear)
    renderAnimeList(listByYear2)
  }
}

function searchResult() {
  document.querySelector('.search__result').innerHTML = `Search results: <span class="search__key purple"></span>`;
}

function emptySearchResult() {
  document.querySelector('.search__result').innerHTML = "";
  document.querySelector('.filter__container').innerHTML = "";
}

function pageLoading() {
  document.querySelector('.anime__container').classList.add('anime__loading')
}

function pageLoadingRemove() {
  document.querySelector('.anime__container').classList.remove('anime__loading')
}

function emptyContainer() {
  document.querySelector('.anime__container').innerHTML = `<i class="fa-solid fa-spinner anime__loading--spinner"></i>`

}




