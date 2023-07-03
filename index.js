document.addEventListener('DOMContentLoaded', function() {
  fetch('http://localhost:3000/films/1')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      updateMovieDetails(data);
    })
    .catch(error => console.log(error));

  fetch('http://localhost:3000/films')
    .then(response => response.json())
    .then(data => {
      const filmsList = document.getElementById('films');
      data.forEach(film => {
        const listItem = document.createElement('li');
        listItem.textContent = film.title;
        listItem.classList.add('film', 'item');
        filmsList.appendChild(listItem);

        listItem.addEventListener('click', function(e) {
          document.getElementById('main-title').innerHTML = film.title;
          fetch(`http://localhost:3000/films/${film.id}`)
            .then(response => response.json())
            .then(data => {
              updateMovieDetails(data);
              e.preventDefault();
            })
            .catch(error => console.log(error));
        });
      });
    });

  function updateMovieDetails(movie) {
    const movieDetails = document.getElementById('movie-details');
    const moviePoster = movieDetails.querySelector('#movie-poster');
    const movieTitle = movieDetails.querySelector('#movie-title');
    const movieRuntime = movieDetails.querySelector('#movie-runtime');
    const movieShowtime = movieDetails.querySelector('#movie-showtime');
    const movieAvailableTickets = movieDetails.querySelector('#movie-available-tickets');
    const buyTicketButton = movieDetails.querySelector('#buy-ticket');

    moviePoster.src = movie.poster;
    movieTitle.textContent = movie.title;
    movieRuntime.textContent = `Runtime: ${movie.runtime} minutes`;
    movieShowtime.textContent = `Showtime: ${movie.showtime}`;
    const availableTickets = movie.capacity - movie.tickets_sold;
    movieAvailableTickets.textContent = `Available Tickets: ${availableTickets}`;

    if (availableTickets === 0) {
      buyTicketButton.disabled = true;
      buyTicketButton.textContent = 'Sold Out';
    } else {
      buyTicketButton.disabled = false;
      buyTicketButton.textContent = 'Buy Ticket';
    }

    buyTicketButton.addEventListener('click', function(e) {
      e.preventDefault();
      if (availableTickets > 0) {
        movie.tickets_sold += 1;
        const updatedAvailableTickets = movie.capacity - movie.tickets_sold;
        movieAvailableTickets.textContent = `Available Tickets: ${updatedAvailableTickets}`;

        if (updatedAvailableTickets === 0) {
          buyTicketButton.disabled = true;
          buyTicketButton.textContent = 'Sold Out';
        }

      
        fetch(`http://localhost:3000/films/${movie.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tickets_sold: movie.tickets_sold
          })
        })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.log(error));
      }
    });
  }
});
