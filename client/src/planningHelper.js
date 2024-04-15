import { convertToCoordinates } from "./boardHelper";
import { getDefaultBoard } from "./gameConfigDefaults";

const boardData = getDefaultBoard();
export const isInBoardRange = (rI, cI) => (rI >=0 && rI<= 9) && (cI >=0 && cI <=9) && boardData[rI][cI] === '';

export const doesPositionOccupied = (strategy, position) => (strategy || []).some((ship) => (ship || []).some((sPosition) => sPosition === position));

export const hasSpacesForShipPlacement = (strategy, rI, cI, sSize, pType = 'row') => {
  let index;
  let hasSpace = true;

  if (pType === 'row') {
    for (index = cI; index < cI + sSize; index++) {
      hasSpace = hasSpace && isInBoardRange(rI, index) && !doesPositionOccupied(strategy, Number(`${rI}${index}`));
      if (!hasSpace) {
        break;
      }
    }
  } else if (pType === 'col') {
    for (index = rI; index < rI + sSize; index++) {
      hasSpace = hasSpace && isInBoardRange(index, cI) && !doesPositionOccupied(strategy, Number(`${index}${cI}`));
      if (!hasSpace) {
        break;
      }
    }
  }

  return hasSpace;
};

export const placeShip = (strategy, rI, cI, sSize, pType = 'row') => {
  let index;
  let ship = [];

  if (pType === 'row') {
    for (index = cI; index < cI + sSize; index++) {
      ship.push(Number(`${rI}${index}`));
    }
  } else if (pType === 'col') {
    for (index = rI; index < rI + sSize; index++) {
      ship.push(Number(`${index}${cI}`));
    }
  }

  if (ship.length) {
    strategy.push(ship)
  }

  return strategy;
};

export const removeShip = (strategy, ship) => {
  const shipIndex = strategy.findIndex((s) => s[0] === ship[0]);

  if (shipIndex > -1) {
    strategy.splice(shipIndex, 1);
  }

  return strategy;
};

export const rotateShip = (strategy, ship, pType = 'row') => {
  const position = ship[0];
  const { rIndex, cIndex } = convertToCoordinates(position);

  return placeShip(removeShip(strategy, ship), rIndex, cIndex, ship.length, pType);
};

export const getShipPosition = (ship) => {
  const [first, second] = ship;

  return ((first + 1) === second) ? 'row' : 'col';
};
