import { Movie } from "@/models/movie";
import styles from './styles.module.scss';

interface IProps {
  movie: Movie
}

export default function MovieCard({ movie }: IProps) {
  return (
    <div className={`${styles.movieCard} ${styles.cardHover}`}>
      <h2>{movie.title}</h2>
      <p className={styles.info}>Studio: {movie.studio.studio}</p>
      <p className={styles.info}>Genre: {movie.genre.genre}</p>
      <p className={styles.score}>Audience Score: {movie.audience_score}</p>
      <p className={styles.year}>Year: {movie.year}</p>
    </div>
  );
};