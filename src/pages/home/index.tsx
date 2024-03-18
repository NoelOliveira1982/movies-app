// pages/index.tsx

import React, { useState } from 'react';
import MovieCard from '@/components/movie-card';
import { http } from '@/db/client';
import { Movie } from '@/models/movie';
import styles from './styles.module.scss';
import { Studio } from '@/models/studio';
import { Genre } from '@/models/genre';

interface IProps {
  data: Movie[];
  studios: Studio[];
  genres: Genre[];
}

export async function getStaticProps() {
  try {
    const response = await http.get('/movie');
    const data = response.data;

    const responseStudios = await http.get<Studio[]>('/studio');
    const responseGenres = await http.get<Genre[]>('/genre');

    return {
      props: { data, studios: responseStudios.data, genres: responseGenres.data },
    };
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return {
      props: { data: [], studios: [], genres: [] },
    };
  }
}

export default function Home({ data, genres, studios }: IProps) {
  const [selectedStudio, setSelectedStudio] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [audienceScore, setAudienceScore] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAudienceScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAudienceScore(Number(event.target.value));
  };

  const filteredMovies = data.filter(movie => {
    const studioCondition = selectedStudio ? movie.studio.id_studio === selectedStudio : true;
    const genreCondition = selectedGenre ? movie.genre.id_genre === selectedGenre : true;
    const audienceScoreCondition = audienceScore ? parseFloat(movie.audience_score) >= audienceScore : true;
    const searchCondition = searchTerm ? movie.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;

    return studioCondition && genreCondition && audienceScoreCondition && searchCondition;
  });

  return (
    <div className={styles.moviesPage}>
      <h1 className={styles.pageTitle}>Movies</h1>
      <div className={styles.filterContainer}>
        <div className={styles.filterGroup}>
          <label htmlFor="studioFilter">Studio:</label>
          <select
            id="studioFilter"
            value={selectedStudio}
            onChange={e => setSelectedStudio(e.target.value)}
          >
            <option value="">All</option>
            {studios.map(studio => (
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
            {genres.map(genre => (
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
      <div className={styles.moviesContainer}>
        {filteredMovies.map(movie => (
          <MovieCard key={movie.id_movie} movie={movie} />
        ))}
      </div>
    </div>
  );
}
