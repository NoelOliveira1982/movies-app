// pages/index.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Importe o useRouter do Next.js
import MovieCard from '@/components/movie-card';
import { http } from '@/db/client';
import styles from './styles.module.scss';
import { Studio } from '@/models/studio';
import { Genre } from '@/models/genre';
import LoginModal from '@/components/modal-login';
import { Enterprise } from '@/models/enterprise';
import { movieEnterprise } from '@/models/movie-enterprise';
import { applyFormatToDocument } from '@/utils/format-document';
import PaymentModal from '@/components/payment-modal';
import { User } from '@/models/user';

interface IProps {
  data: movieEnterprise[];
  studios: Studio[];
  genres: Genre[];
  enterprises: Enterprise[];
}

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

const Home: React.FC<IProps> = ({ data, genres, studios, enterprises }) => {
  const [selectedStudio, setSelectedStudio] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedEnterprise, setSelectedEnterprise] = useState('');
  const [audienceScore, setAudienceScore] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedMovieToRent, setSelectedMovieToRent] = useState<movieEnterprise | null>(null);
  const router = useRouter(); // Adicione o useRouter

  const handleAudienceScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAudienceScore(Number(event.target.value));
  };

  const handleAlugarClick = (movie: movieEnterprise) => {
    setSelectedMovieToRent(movie);
    setIsPaymentModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPaymentModalOpen(false);
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await http.post<User>('user/login', { username, password });
      if (response.data.id_user) {
        setIsLoggedIn(true);
        setUser(response.data);
        alert('Login realizado com sucesso');
        return;
      }
      alert('Usuário não encontrado ou senha incorreta');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      // Tratar o erro conforme necessário
    } finally {
      setIsLoginModalOpen(false);
    }
  };


  const filteredMovies = data.filter(movie => {
    const studioCondition = selectedStudio ? movie.movie.studio.id_studio === selectedStudio : true;
    const genreCondition = selectedGenre ? movie.movie.genre.id_genre === selectedGenre : true;
    const enterpriseCondition = selectedEnterprise ? movie.enterprise.id_enterprise === selectedEnterprise : true;
    const audienceScoreCondition = audienceScore ? parseFloat(movie.movie.audience_score) >= audienceScore : true;
    const searchCondition = searchTerm ? movie.movie.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;

    return studioCondition && genreCondition && enterpriseCondition && audienceScoreCondition && searchCondition;
  });

  return (
    <div className={styles.moviesPage}>
      {!isLoggedIn && <button onClick={() => setIsLoginModalOpen(true)}>Login</button>}
      {isLoggedIn && <button onClick={() => router.push(`/profile?user=${encodeURIComponent(JSON.stringify(user))}`)}>Go to Profile</button>}
      <button onClick={() => router.push(`/movies`)}>All movies</button>
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
        <div className={styles.filterGroup}>
          <label htmlFor="enterpriseFilter">Enterprise:</label>
          <select
            id="enterpriseFilter"
            value={selectedEnterprise}
            onChange={e => setSelectedEnterprise(e.target.value)}
          >
            <option value="">All</option>
            {enterprises.map(enterprise => (
              <option key={enterprise.id_enterprise} value={enterprise.id_enterprise}>
                {applyFormatToDocument(enterprise.document, enterprise.type_document!.format)}
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
          <MovieCard key={movie.movie.id_movie} movie={movie.movie} isLoggedIn={isLoggedIn} onRent={() => { handleAlugarClick(movie) }} cost={String(movie.cost)} />
        ))}
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={login} />
      {selectedMovieToRent && <PaymentModal isOpen={isPaymentModalOpen} onClose={handleCloseModal}
        cost={String(selectedMovieToRent!.cost)} id_movie={selectedMovieToRent.movie.id_movie} id_user={user!.id_user} />}
    </div>
  );
};

export default Home;
