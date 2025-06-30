// ghostBehaviors.js
import { DIRECTIONS, OBJECT_TYPE } from './setup';

export function randomMovement(position, direction, dto) {
  let dir = direction;
  let nextMovePos = position + dir.movement
  const keys = Object.keys(DIRECTIONS);
  while (
    dto.objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
    dto.objectExist(nextMovePos, OBJECT_TYPE.GHOST)
  ) {
    const key = keys[Math.floor(Math.random() * keys.length)];
    dir = DIRECTIONS[key];
    nextMovePos = position + dir.movement;
  }
  return { nextMovePos, direction: dir };
}
export const blinkyBehavior = (pos, dir, dto) => {
  // Red ghost - Blinky follows Pac-Man
  let nextMovePos = pos + dir.movement;
  let attempts = 0;
  const isInvalidPos = dto.objectExist(nextMovePos, OBJECT_TYPE.WALL) || dto.objectExist(nextMovePos, OBJECT_TYPE.GHOST);

  while (isInvalidPos) {
    if (attempts > 3) {
      dir = dto.pacman.dir;
    } else {
      return randomMovement(pos, dir, dto);
          console.log('Blinky is 22222 to find a valid position');
    }
  }

  return { nextMovePos, direction: dir };
};

export const pinkyBehavior = ( pos, dir, dto) => {
  let nextMovePos = pos + dir.movement
  const keys = Object.keys(DIRECTIONS);
  while (
    dto.objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
    dto.objectExist(nextMovePos, OBJECT_TYPE.GHOST)
  ) {
    const key = keys[Math.floor(Math.random() * keys.length)];
    dir = DIRECTIONS[key];
    nextMovePos = pos + dir.movement;
  }
    return { nextMovePos, direction: dir };

};

export const inkyBehavior = (pos, dir, dto) => {
    console.log('inkyBehavior behavior called', pos, dir, dto);
    return { nextMovePos, direction: dir };
};

export const clydeBehavior = (pos, dir, dto) => {
  let nextMovePos = pos + dir.movement
  const keys = Object.keys(DIRECTIONS);
  while (
    dto.objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
    dto.objectExist(nextMovePos, OBJECT_TYPE.GHOST)
  ) {
    const key = keys[Math.floor(Math.random() * keys.length)];
    dir = DIRECTIONS[key];
    nextMovePos = pos + dir.movement;
  }
    return { nextMovePos, direction: dir };
};