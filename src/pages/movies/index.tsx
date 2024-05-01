// pages/all-movies.tsx

import React, { useEffect, useState } from 'react';
import { http } from '@/db/client';
import { Movie } from '@/models/movie';
import styles from './styles.module.scss'; // Importando o arquivo de estilos
import { Enterprise } from '@/models/enterprise';
import { Genre } from '@/models/genre';
import { Studio } from '@/models/studio';
import router from 'next/router';

export async function getStaticProps() {
  try {
    const response = await http.get('/movie/enterprise');
    const data = response.data;

    const responseStudios = await http.get<Studio[]>('/studio');
    const responseGenres = await http.get<Genre[]>('/genre');
    const responseEnterprises = await http.get<Enterprise[]>('/enterprise');

    return {
      props: { data, studios: responseStudios.data, genres: responseGenres.data, enterprises: responseEnterprises.data },
    };
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return {
      props: { data: [], studios: [], genres: [], enterprises: [] },
    };
  }
}

const AllMoviesPage = ({ studios, genres }: any) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedStudio, setSelectedStudio] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [audienceScore, setAudienceScore] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await http.get<Movie[]>('/movie');
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleAudienceScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAudienceScore(Number(event.target.value));
  };

  const filteredMovies = movies.filter(movie => {
    const studioCondition = selectedStudio ? movie.studio.id_studio === selectedStudio : true;
    const genreCondition = selectedGenre ? movie.genre.id_genre === selectedGenre : true;
    const audienceScoreCondition = audienceScore ? parseFloat(movie.audience_score) >= audienceScore : true;
    const searchCondition = searchTerm ? movie.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;

    return studioCondition && genreCondition && audienceScoreCondition && searchCondition;
  });

  return (
    <div className={styles.allMoviesPage}>

      <button onClick={() => router.back()}>Voltar</button>
      <h1>All Movies</h1>
      <div className={styles.filterContainer}>
        <div className={styles.filterGroup}>
          <label htmlFor="studioFilter">Studio:</label>
          <select
            id="studioFilter"
            value={selectedStudio}
            onChange={e => setSelectedStudio(e.target.value)}
          >
            <option value="">All</option>
            {studios.map((studio: any) => (
              <option key={studio.id_studio} value={studio.id_studio}>
                {studio.studio}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="genreFilter">Genre:</label>
          <select
            id="genreFilter"
            value={selectedGenre}
            onChange={e => setSelectedGenre(e.target.value)}
          >
            <option value="">All</option>
            {genres.map((genre: any) => (
              <option key={genre.id_genre} value={genre.id_genre}>
                {genre.genre}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.sliderContainer}>
          <input
            type="range"
            min="0"
            max="100"
            value={audienceScore}
            className={styles.slider}
            onChange={handleAudienceScoreChange}
          />
          <div className={styles.sliderValue}>Min Audience Score: {audienceScore}</div>
        </div>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ul className={styles.moviesList}>
        {filteredMovies.map((movie) => (
          <li key={movie.id_movie} className={styles.movieItem}>
            <div>
              <h2>{movie.title}</h2>
              <p>Year: {movie.year}</p>
              <p>Studio: {movie.studio.studio}</p>
              <p>Genre: {movie.genre.genre}</p>
              <p>Audience Score: {movie.audience_score}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllMoviesPage;
