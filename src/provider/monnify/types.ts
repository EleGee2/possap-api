export type MonnifyApiRes<D> = {
  requestSuccessful: boolean;
  responseMessage: string;
  responseCode: string;
  responseBody?: D;
};

export type MonnifyAuthResData = {
  accessToken: string;
  expiresIn: number;
};

export type MonnifyNinResData = {
  nin: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;
  mobileNumber: string;
};
