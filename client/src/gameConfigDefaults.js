export const defaultShipConfig = {
  '5': 1,
  '4': 2,
  '3': 3,
  '2': 4,
};
export const defaultRowMarker = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
export const defaultColMarker = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
export const getDefaultBoard = () => Array(10).fill().map(() => Array(10).fill(''));
