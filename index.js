const animeContainer = document.querySelector(".anime__container");
const url = "https://graphql.anilist.co";

// For later Use

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
      </figure>
      <div class="anime__show--description">
        <h3 class="anime__show--title">${title}</h3>
        <h4 class="anime__show--info">Genres: ${show.genres.join(", ")}</h4>
        <h4 class="anime__show--info">Average Score: ${show.averageScore ?? "???"}</h4>
        <h4 class="anime__show--info">Episodes: ${show.episodes ?? "???"}</h4>
        <h4 class="anime__show--info">Year Released: ${show.seasonYear ?? "???"}</h4>
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

  const query = `
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
    }
  `;
    document.querySelector('.search__key').innerHTML = `${searchTerm}`;
  try {
    const data = await fetchAniList(query, { search: searchTerm });
    const list = data.data.Page.media;
    renderAnimeList(list);
  } catch (err) {
    console.error("AniList error:", err);
  }

}

// Page Load

(async function loadTrending() {
  const query = `
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
    }
  `;

  try {
    const data = await fetchAniList(query);
    renderAnimeList(data.data.Page.media);
  } catch (err) {
    console.error("AniList error:", err);
  }
})();
