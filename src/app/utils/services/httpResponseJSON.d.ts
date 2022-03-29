export interface ResponseJSONType<T = any> {
  code: number;
  result?: T;
  msg?: string;
}
