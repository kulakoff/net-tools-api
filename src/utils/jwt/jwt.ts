import jwt, { sign, verify, SignOptions } from "jsonwebtoken";
import config from "config";
import * as fs from "fs";
import * as path from "path";

export const signJwt = (
  payload: Object,
  key: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options: SignOptions = {}
) => {
  // const privateKey = Buffer.from(config.get<string>(key), "base64").toString(
  //   "ascii"
  // );
  // const privateKey = fs.readFileSync(path.join(__dirname, './../../../private.key'));
  const privateKey = fs
    .readFileSync(path.join(__dirname, `./keys/${key}.pem`))
    .toString("ascii");

  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

/**
 *
 * @param token  string
 * @param key  'accessTokenPublicKey' | 'refreshTokenPublicKey'
 * @returns
 */
export const verifyJwt = <T>(
  token: string,
  key: "accessTokenPublicKey" | "refreshTokenPublicKey"
  // options: SignOptions = {}
): T | null => {
  try {
    console.log(":: DEBUG | verifyJwt | token :: ", token);
    // const publicKey = Buffer.from(config.get<string>(key), "base64").toString(
    //   "ascii"
    // );
    const publicKey = fs
      .readFileSync(path.join(__dirname, `./keys/${key}.pem`))
      .toString("ascii");

    return jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as T;
  } catch (error) {
    return null;
  }
};
