export type Position = {
  x: number;
  y: number;
};

export type Direction = {
  x: 1 | 0 | -1;
  y: 1 | 0 | -1;
};

export type Space = {
  width: number;
  height: number;
};

export const describePosition = (position: Position): string =>
  `[${position.x}, ${position.y}]`;

export const positionExists = (position: Position, space: Space): boolean => {
  const { x, y } = position;
  const { width, height } = space;
  return x >= 0 && y >= 0 && x <= width && y <= height;
};

export const positionsMatch = (pos1: Position, pos2: Position) => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

export const getDistance = (pos1: Position, pos2: Position) => {
  return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);
};

export const getRandomDirection = (): Direction => {
  const sign = Math.random() > 0.5 ? 1 : -1;
  const axis = Math.random() > 0.5 ? "x" : "y";
  return axis === "x" ? { x: sign, y: 0 } : { x: 0, y: sign };
};
