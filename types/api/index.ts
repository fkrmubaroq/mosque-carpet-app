export enum ApiMessage {
  StatusOk = 0,
  ErrorMessage = 1
}

export type TResponseDataApi<TData> = {
  code: ApiMessage,
  data: TData,
  message: string,
}