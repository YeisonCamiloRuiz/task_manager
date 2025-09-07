export interface JwtPayload {
    sub: string;
    email: string;
}

export interface refreshTokenPayload {
    accesToken:string;
    refreshToken:string;
}
  