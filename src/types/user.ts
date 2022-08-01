export interface IRegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface ITokenPayload {
  user: string;
  deviceId: string;
  sessionId: string;
}
