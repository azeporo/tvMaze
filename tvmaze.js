async function searchShows(query) {
  let response = await axios.get('https://api.tvmaze.com/search/shows?q=', {params: {q: query}})

  let shows = response.data.map(result => {    
    return{
      id: result.show.id,
      name: result.show.name,
      summary:result.show.summary,
      image: result.show.image ? result.show.image.medium : 'https://tinyurl.com/tv-missing',
    }
  })
  return shows;
}

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-sm-6 col-md-4 col-lg-3 mt-5 Show" data-show-id="${show.id}">
         <div class="card bg-light h-100" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <div class="d-grid">
              <button type= "button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#exampleModal">View Episodes</button>
             </div>
           </div>
         </div>
       </div>
      `);
    $showsList.append($item);
  }
}

//SHOW DATA REQUEST
$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

//EPISODES DATA REQUEST
$('#shows-list').on('click','button', async function episodeRequest (evt){
  evt.preventDefault();
  let id = evt.target.parentElement.parentElement.parentElement.getAttribute('data-show-id')

  let episodes = await getEpisodes(id);
  populateEpisodes(episodes);
  $("#episodes-area").show();
})

async function getEpisodes(id) {
  let response = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)

  let episodesList = response.data.map(episode => {
    return{
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
    }
  })
  return episodesList;
}

function populateEpisodes(episodesList){
  $('#episodes-list').empty();
  
  for (let episode of episodesList){
    let episodeInfo = `<li>S${episode.season} E${episode.number} - ${episode.name} </li>`
    $('#episodes-list').append(episodeInfo)
  }
}