//Возвращаемый объект при регистрации
//TODO доделать типизпцию
export class UserDto {
  email;
  id;
  isActivated;
  roles;

  constructor(model: any) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.roles = [...model.roles];
  }
}

export class UserTokenPayload {
  user;
  constructor(model: any) {
    this.user = model._id;
  }
}

export class UserInfoDto {
  id;
  firstName;
  lastName;
  email;
  phoneNumber;
  isActivated;
  activatedAt;
  // activationLink;
  roles;
  createdAt;
  updatedAt;
  constructor(model: any) {
    this.id = model._id;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
    this.email = model.email;
    this.phoneNumber = model.phoneNumber;
    this.activatedAt = model.activatedAt;
    this.isActivated = model.isActivated;
    // this.activationLink = model.activationLink;
    this.roles = [...model.roles];
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}
