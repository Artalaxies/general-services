

export const errorHandler = (error: unknown) => <Error>error;


export const throwError = <E>(error: E): E => {
  throw error;
};
