import { Genre } from "./genre";
import { Studio } from "./studio";

export interface Movie {
  id_movie: string;
  title: string;
  studio: Studio;
  audience_score: string;
  year: number;
  genre: Genre;
}