import {
  getCookie,
  removeCookie,
  setCookie,
} from "../../helpers/cookies.helper";

/**
 * Initialize authenticated user session.\
 */
export const initAuthenticatedSession = (data: any) => {
  setCookie("ACCESS_TOKEN", data.access_token);
  setCookie("REFRESH_TOKEN", data.refresh_token);
  //   setCookie("SCOPE", data.scope);
  //   setCookie("ID_TOKEN", data.id_token);
  //   setCookie("TOKEN_TYPE", data.token_type);
  //   setCookie("EXPIRES_IN", data.expires_in);
};

/**
 * Get session parameter from cookie storage.
 *
 * @param key
 * @return {string}
 */
export const getSessionParameter = (key: any) => {
  return getCookie(key);
};

/**
 * Reset authenticated session.
 */
export const resetAuthenticatedSession = () => {
  removeCookie("ACCESS_TOKEN");
  removeCookie("REFRESH_TOKEN");
  //   removeCookie("SCOPE");
  //   removeCookie("ID_TOKEN");
  //   removeCookie("TOKEN_TYPE");
  //   removeCookie("EXPIRES_IN");
};

/**
 * Returns whether session is valid.
 *
 * @return {boolean}
 */
export const isValidSession = () => {
  const token = getCookie("ACCESS_TOKEN");
  return !!token;
};

/**
 * Get all session parameters.
 *
 * @returns {{}}
 */
export const getAllSessionParameters = () => {
  const session: any = {};

  session["ACCESS_TOKEN"] = getCookie("ACCESS_TOKEN");
  session["REFRESH_TOKEN"] = getCookie("REFRESH_TOKEN");
  //   session["SCOPE"] = getCookie("SCOPE");
  //   session["ID_TOKEN"] = getCookie("ID_TOKEN");
  //   session["TOKEN_TYPE"] = getCookie("TOKEN_TYPE");
  //   session["EXPIRES_IN"] = getCookie("EXPIRES_IN");

  return session;
};

/**
 * Base64 decodes the ID token
 *
 * @param token id token
 * @return {any}
 */
export const decodeIdToken = (token: any) => {
  return JSON.parse(atob(token.split(".")[1]));
};
