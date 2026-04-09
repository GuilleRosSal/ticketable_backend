const emailRegex =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

const validRoles = ['CLIENT'];

export const isEmail = (email) => emailRegex.test(email);

export const validRole = (role) => validRoles.includes(role);

export const isValidPositiveNumber = (number) => Number.isInteger(number) && number > 0;
