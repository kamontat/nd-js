// information that require to generate token
export interface RequireTokenData {
  version: string;
  issuedate: string;
  expiredate: string;
  notbeforedate: string;
  fullname: string;
  username: string;
  versionrange: string;
}

// information that save in token
export interface ResultTokenData {
  version: string;
  token: string;
  name: string;
  iat: number;
  nbf: number;
  exp: number;
  iss: string;
  sub: string;
  jti: string;
}
