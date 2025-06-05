export interface WithResponse<T> {
  ok: boolean;
  data: T[];
}
