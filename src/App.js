import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-http-642ee-default-rtdb.firebaseio.com/movies.json');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();

      const loadMovies= [];
      for (const keys in data){
        loadMovies.push({
          id:keys,
          title:data[keys].title,
          openingText:data[keys].openingText,
          releaseDate:data[keys].releaseDate

        })
      }
      setMovies(loadMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

 async function addMovieHandler(movie) {
   const response= await fetch('https://react-http-642ee-default-rtdb.firebaseio.com/movies.json',{
      method: 'POST',
      // by default mwthod is GET
      body: JSON.stringify(movie),
      // JSON.stringify()is used to convert Java script expression to json format
      headers: {
      'Content-Type' : 'application/json'
      }
    });
    // fetch function is not just used to fetch data but its also used to send data to the server...........
    // json is a data format which is basically used for exchanging data between frontend and backend 
    const data = await response.json();
    console.log(data);
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Ruk ja bsdk dikha raha hu.....</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
