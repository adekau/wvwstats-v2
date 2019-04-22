export interface IGlicko {
  id: number;
  glicko: {
    rating: number,
    deviation: number,
    volatility: number,
    delta: number,
  };
}
