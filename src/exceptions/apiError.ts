//TODO доделать типизацию

export default class ApiError extends Error {
  status;
  errors;

  constructor(status: any, message: any, errors: any[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, "Пользователь не авторизован");
  }

  static BadRequest(message: any, errors: any[] = []) {
    return new ApiError(400, message, errors);
  }

  static NotFound(message: any, errors: any[] = []) {
    return new ApiError(404, message, errors);
  }

  static UnprocessableEntity(message: any, errors: any[any] = []) {
    return new ApiError(422, message, errors);
  }
};
