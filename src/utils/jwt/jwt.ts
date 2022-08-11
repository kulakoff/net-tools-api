import { sign, verify, SignOptions } from "jsonwebtoken";
import * as fs from "fs";
import * as path from "path";
import config from "config";

/**
 * Подпись jwt token
 */
export const signJwt = (
  payload: Object,
  key: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options: SignOptions = {}
) => {

  //Получаем приватный ключ для создания токена
  const privateKey = fs
    .readFileSync(path.join(__dirname, `./keys/${key}.pem`))
    .toString("ascii");

  return sign(payload, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

/**
 * Проверка jwt token
 */
export const verifyJwt = <T>(
  token: string,
  key: "accessTokenPublicKey" | "refreshTokenPublicKey"
  // options: SignOptions = {}
): T | null => {
  try {

    //Получаем публичный ключ для валидации токена
    const publicKey = fs
      .readFileSync(path.join(__dirname, `./keys/${key}.pem`))
      .toString("ascii");

    return verify(token, publicKey, { algorithms: ["RS256"] }) as T;
  } catch (error) {
    return null;
  }
};
