import { TypeText } from './constants';

export const getTextY = (type, height) => {
  switch (type) {
    case TypeText.HEADING:
      return height / 10;
    case TypeText.MESSAGE:
      return height / 7;
    default:
      return height / 2;
  }
};
