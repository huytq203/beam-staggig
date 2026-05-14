import Cookie from "universal-cookie";
// import { CONFIG } from "../config";

const CONFIG = {
  COOKIE_PATH: "/",
};

/**
 * Sets a cookie when the name, value and path is passed in.
 *
 * @param cookieName - Name of the cookie.
 * @param cookieValue - Value of the cookie.
 * @param cookiePath - Path of the cookie. Defaults to "/".
 */
export function setCookie(
  cookieName: any,
  cookieValue: any,
  cookiePath = CONFIG.COOKIE_PATH
) {
  const cookie = new Cookie();
  cookie.set(cookieName, cookieValue, {
    path: cookiePath,
    expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  });
}

/**
 * Removes a cookie when the name and the path is passed in.
 *
 * @param cookieName - Name of the cookie.
 * @param cookiePath - Path of the cookie. Defaults to "/".
 */
export function removeCookie(cookieName: any, cookiePath = CONFIG.COOKIE_PATH) {
  const cookie = new Cookie();
  cookie.remove(cookieName, {
    path: cookiePath,
  });
}

/**
 * Retrieves a cookie.
 *
 * @param cookieName - Name of the cookie.
 * @return {any}
 */
export function getCookie(cookieName: any) {
  const cookie = new Cookie();
  return cookie.get(cookieName);
}
