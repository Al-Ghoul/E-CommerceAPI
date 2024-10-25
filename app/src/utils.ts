import * as jose from "jose";

/* eslint @typescript-eslint/no-wrapper-object-types: off */
export async function GenerateAccessToken(userId: BigInt) {
  return await new jose.SignJWT()
    .setProtectedHeader({ alg: "HS256", typ: "access" })
    .setSubject(`E-Commerce-API|${userId.toString()}`)
    .setIssuer(process.env.TOKEN_ISSUER!)
    .setAudience(process.env.TOKEN_ISSUER!)
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(new TextEncoder().encode(process.env.TOKEN_SECRET!));
}

/* eslint @typescript-eslint/no-wrapper-object-types: off */
export async function GenerateRefreshToken(userId: BigInt) {
  return await new jose.SignJWT({ typ: "refresh" })
    .setProtectedHeader({ alg: "HS256", typ: "refresh" })
    .setSubject(`E-Commerce-API|${userId.toString()}`)
    .setIssuer(process.env.TOKEN_ISSUER!)
    .setAudience(process.env.TOKEN_ISSUER!)
    .setIssuedAt()
    .setExpirationTime("5d")
    .sign(new TextEncoder().encode(process.env.TOKEN_SECRET!));
}
