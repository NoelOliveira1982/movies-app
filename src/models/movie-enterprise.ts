import { Enterprise } from "./enterprise";
import { Movie } from "./movie";

export interface movieEnterprise {
  movie: Movie;
  enterprise: Enterprise;
  cost: bigint;
}