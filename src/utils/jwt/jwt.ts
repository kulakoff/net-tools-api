import jwt, { sign, verify, SignOptions } from "jsonwebtoken";
import config from "config";

export const signJwt = (
  payload: Object,
  key: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options: SignOptions = {}
) => {
  const privateKey = Buffer.from(config.get<string>(key), "base64").toString(
    "ascii"
  );

  return jwt.sign(payload, privateKey, {
    ...(options && options),
    // algorithm: "RS512",

    
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
): T | null => {
  try {
    const publicKey = Buffer.from(config.get<string>(key), "base64").toString(
      "ascii"
    );
    console.log("publicKey >>> ", publicKey);
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    return null;
  }
};
