import { Movie } from "./movie";
import { Payment } from "./payment";

export interface User {
  id_user: string;
  username: string;
  password: string;
  User_Movie: {
    movie: Movie;
  }[];
}