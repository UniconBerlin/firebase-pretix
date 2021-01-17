// eslint-disable-next-line
import type {Request} from "express";

/**
 *
 * @param {any} o object
 * @return {[]} typed object keys
 */
export function typedKeys<T>(o: T): (keyof T)[] {
  // type cast should be safe because that's what really Object.keys() does
  return Object.keys(o) as (keyof T)[];
}

/**
 *
 * @param {express.Request} req express request object
 * @return {user} user object
 */
export function parseRequestBody(req: Request) {
  const requestBody = {
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    emailVerified: req.body.emailVerified,
    password: req.body.password,
    displayName: req.body.displayName,
    photoURL: req.body.photoURL,
    disabled: req.body.disabled,
  };

  const user: {
        email?: string,
        phoneNumber?: string,
        emailVerified?: boolean,
        password?: string,
        displayName?: string,
        photoURL?: string,
        disabled?: boolean,
    } = {};

  typedKeys(requestBody).forEach((key) => {
    if (requestBody[key] !== undefined) {
      user[key] = requestBody[key];
    }
  });
  return user;
}
