import React, { useState, useEffect } from "react";
import "./Home.css";
import Header from "./../../common/header/Header";
import moviesData from "./../../common/moviesData";
import UpcomingMoviesDB from "./../../common/UpcomingMoviesDB";
import UpComingMovies from "./HomeComponents/UpcomingMovies";
import AllMovies from "./HomeComponents/AllMovies";
import MoviesFilterForm from "./HomeComponents/MoviesFilterForm";
import genres from "./../../common/genres";
import artists from "./../../common/artists";

const Home = () => {
  const [movies, setMovies] = useState(moviesData);
  const [filterFormValues, setFilterFormValues] = useState({
    movieName: "",
    genresList: [],
    artistsList: [],
    releaseDateStart: null,
    releaseDateEnd: null,
  });

  const filterList = () => {
    let finalFilteredMovieList = moviesData;
    const formValues = { ...filterFormValues };
    if (formValues.movieName) {
      finalFilteredMovieList = finalFilteredMovieList.filter(
        movie =>
          movie.title.toLowerCase().match(formValues.movieName.toLowerCase())
      );
    }
    if (formValues.genresList.length > 0) {
      finalFilteredMovieList = finalFilteredMovieList.filter(movie => {
        for (let i = 0; i < formValues.genresList.length; i++) {
          if (movie.genres.includes(formValues.genresList[i].name)) return true;
        }
        return false;
      });
    }
    if (formValues.artistsList.length > 0) {
      finalFilteredMovieList = finalFilteredMovieList.filter(movie => {
        const fullNameArray = [];
        movie.artists.forEach(artist =>
          fullNameArray.push(`${artist.first_name} ${artist.last_name}`)
        );
        for (let i = 0; i < formValues.artistsList.length; i++) {

          if (fullNameArray.includes(`${formValues.artistsList[i].first_name} ${formValues.artistsList[i].last_name}`))
            return true;
        }
        return false;
      });
    }

    if (formValues.releaseDateStart && formValues.releaseDateEnd) {
      const releaseDateStart = new Date(formValues.releaseDateStart);
      const releaseDateEnd = new Date(formValues.releaseDateEnd);
      finalFilteredMovieList = finalFilteredMovieList.filter(movie => {
        const movieReleaseDate = new Date(movie.release_date);
        return (
          movieReleaseDate >= releaseDateStart &&
          movieReleaseDate <= releaseDateEnd
        );
      });
    } else if (formValues.releaseDateStart && !formValues.releaseDateEnd) {
      const releaseDateStart = new Date(formValues.releaseDateStart);
      finalFilteredMovieList = finalFilteredMovieList.filter(movie => {
        const movieReleaseDate = new Date(movie.release_date);
        return movieReleaseDate >= releaseDateStart;
      });
    } else if (!formValues.releaseDateStart && formValues.releaseDateEnd) {
      const releaseDateEnd = new Date(formValues.releaseDateEnd);
      finalFilteredMovieList = finalFilteredMovieList.filter(movie => {
        const movieReleaseDate = new Date(movie.release_date);
        return movieReleaseDate <= releaseDateEnd;
      });
    }
    setMovies(finalFilteredMovieList);
  };

  const handleSubmit = e => {
    e.preventDefault();
    filterList();
  };

  const handleChange = e => {
    const formValues = { ...filterFormValues };
    formValues[e.target.name] = e.target.value;
    setFilterFormValues(formValues);
  };

  const handleAutoCompleteChange = (e, v) => {
    const formValues = { ...filterFormValues };
    formValues[`${e.target.id.split("-")[0]}List`] = v;
    setFilterFormValues(formValues);
  };

  const handleDateChange = (d, v, name) => {
    const formValues = { ...filterFormValues };
    formValues[name] = new Date(d).toDateString();
    setFilterFormValues(formValues);
  };

  return (
    <div>
      <Header />
      <div className="upcoming-movies-header">
        <span>Upcoming Movies</span>
      </div>
      <UpComingMovies movies={UpcomingMoviesDB} />
      <div className="flex-container">
        <div className="left">
          <AllMovies movies={movies} />
        </div>
        <div className="right">
          <MoviesFilterForm
            genres={genres}
            artists={artists}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleAutoCompleteChange={handleAutoCompleteChange}
            handleDateChange={handleDateChange}
            releaseDateStart={filterFormValues.releaseDateStart}
            releaseDateEnd={filterFormValues.releaseDateEnd}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;