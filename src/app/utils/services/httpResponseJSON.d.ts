export interface ResponseJSONType<T = any> {
  code: number;
  result?: T;
  msg?: string;
  status?: 1 | 0;
}
