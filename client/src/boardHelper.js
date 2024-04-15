
import { defaultColMarker, defaultRowMarker } from './gameConfigDefaults';

export const convertToCoordinates = (position) => {
  const rIndex = Math.floor(position / 10);
  const cIndex = position % 10;

  return { rIndex, cIndex };
};

export const convertToMarker = (position) => {
  const { rIndex, cIndex } = convertToCoordinates(position);

  return `${defaultColMarker[rIndex]}${defaultRowMarker[cIndex]}`
};