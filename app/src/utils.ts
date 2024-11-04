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
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(process.env.TOKEN_SECRET!));
}

export async function VerifyAccessToken(token: string | undefined) {
  return await jose.jwtVerify(
    token!,
    new TextEncoder().encode(process.env.TOKEN_SECRET!),
  );
}

export async function fetchWithAuth(url: string, options = {}) {
  const fetchOptions = {
    ...options,
  };

  let response = await fetch(url, fetchOptions);
  if (response.status === 401) {
    const data = await response.json();
    if (
      data?.detail === "Invalid Token" ||
      data?.message === "Invalid or expired access token"
    ) {
      const refreshResponse = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (refreshResponse.ok) {
        response = await fetch(url, fetchOptions);
        return response.json();
      } else {
        // Handle refresh failure (e.g., logout user)
        window.location.href = "/auth/logout";
      }
    }
  }

  if (!response.ok) {
    if (response.status === 404 && url.endsWith("/carts")) {
      response = await fetch(url, {
        method: "POST",
      });
    } else {
      return Promise.reject(await response.json());
    }
  }

  return response.json();
}
