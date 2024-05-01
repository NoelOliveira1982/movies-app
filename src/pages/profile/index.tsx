// pages/profile.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './styles.module.scss';
import { User } from '@/models/user';
import { Movie } from '@/models/movie';
import { http } from '@/db/client';

const ProfilePage = () => {
  const router = useRouter();
  const { user } = router.query;

  let parsedUser: User | null = null;
  if (typeof user === 'string') {
    parsedUser = JSON.parse(decodeURIComponent(user));
  }

  const [showUserMovies, setShowUserMovies] = useState(false);
  const [movies, setMovies] = useState<Movie[] | null>();

  const handleShowMoviesClick = async () => {
    setShowUserMovies(!showUserMovies);
    const data = await http.get<User>('user/' + parsedUser?.id_user).then(data => data.data);
    setMovies(data.User_Movie.map(movie => movie.movie));
  };

  return (
    <div className={styles.profilePage}>
      <h1>Welcome to the Profile Page</h1>
      {parsedUser && (
        <div>
          <button onClick={() => router.back()}>Voltar</button>
          <p>User ID: {parsedUser.id_user}</p>
          <p>Username: {parsedUser.username}</p>
          <h2>Movies:</h2>
          <button onClick={handleShowMoviesClick}>
            {showUserMovies ? 'Hide My Movies' : 'Show My Movies'}
          </button>
          {showUserMovies && (
            <ul>
              {movies?.map((movie) => (
                <li key={movie.id_movie}>
                  {movie.title} - {movie.year}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
