/** @file Ghost behaviors and pathfinding logic for each ghost in the game. */

import { DIRECTIONS, OBJECT_TYPE } from './setup';

/**
 * Returns valid neighbors for the ghost to move to
 * @param {number} index -Actual postion of the ghost
 * @param {object} dto - Actual state of the game
 * @returns {{pos: number, dir: object}[]} Valid neighbors with their directions
 */
function getNeighbors(index, dto) {
  return Object.values(DIRECTIONS)
    .map(dir => ({ pos: index + dir.movement, dir }))
    .filter(({ pos }) =>
      !dto.objectExist(pos, OBJECT_TYPE.WALL) &&
      !dto.objectExist(pos, OBJECT_TYPE.GHOST)
    );
}

/**
 * Dijkstra to find the shortest path
 * @param {number} start 
 * @param {number} target 
 * @param {object} dto 
 * @returns {number[] | null} 
 */
function findShortestPath(start, target, dto) {
  const visited = new Set();
  const distances = {};
  const previous = {};
  const queue = [];

  distances[start] = 0;
  queue.push({ pos: start, cost: 0 });

  while (queue.length) {
    queue.sort((a, b) => a.cost - b.cost);
    const { pos } = queue.shift();

    if (visited.has(pos)) continue;
    visited.add(pos);

    if (pos === target) break;

    const neighbors = getNeighbors(pos, dto);
    for (const { pos: neighborPos } of neighbors) {
      if (visited.has(neighborPos)) continue;

      const newDist = distances[pos] + 1;
      if (newDist < (distances[neighborPos] ?? Infinity)) {
        distances[neighborPos] = newDist;
        previous[neighborPos] = pos;
        queue.push({ pos: neighborPos, cost: newDist });
      }
    }
  }

  const path = [];
  let curr = target;
  while (previous[curr] !== undefined) {
    path.unshift(curr);
    curr = previous[curr];
  }

  return path.length === 0 ? null : path;
}

/**
 * Random movement for ghosts avoiding walls and other ghosts
 * @param {number} position
 * @param {object} direction 
 * @param {object} dto 
 * @returns {{nextMovePos: number, direction: object}} 
 */
export function randomMovement(position, direction, dto) {
  let dir = direction;
  let nextMovePos = position + dir.movement;
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

/**
 * Blinky follows pacman directly
 * @param {number} pos
 * @param {object} dir
 * @param {object} dto
 * @returns {{nextMovePos: number, direction: object}}
 */
export const blinkyBehavior = (pos, dir, dto) => {
  const pacDir = dto.pacman.dir;
  const pacPos = dto.pacman.pos;
  let nextMovePos = pos;

  if (
    !dto.objectExist(nextMovePos, OBJECT_TYPE.WALL) &&
    !dto.objectExist(nextMovePos, OBJECT_TYPE.GHOST)
  ) {
    return { nextMovePos, direction: pacDir };
  }

  const path = findShortestPath(pos, pacPos, dto);
  if (path && path.length > 0) {
    const moveTo = path[0];
    const newDir = Object.values(DIRECTIONS).find(d => pos + d.movement === moveTo);
    return { nextMovePos: moveTo, direction: newDir || dir };
  }

  return { nextMovePos: pos, direction: dir };
};

/**
 * Pinky tries to intercept Pacman 4 spaces ahead
 * @param {number} pos
 * @param {object} dir
 * @param {object} dto
 * @returns {{nextMovePos: number, direction: object}}
 */
export const pinkyBehavior = (pos, dir, dto) => {
  const pacDir = dto.pacman.dir;
  const pacPos = dto.pacman.pos;

  let target = pacPos;
  if (pacDir) {
    target = pacPos + pacDir.movement * 4;
  }

  if (
    dto.objectExist(target, OBJECT_TYPE.WALL) ||
    dto.objectExist(target, OBJECT_TYPE.GHOST)
  ) {
    target = pacPos;
  }

  const path = findShortestPath(pos, target, dto);
  if (path && path.length > 0) {
    const moveTo = path[0];
    const newDir = Object.values(DIRECTIONS).find(d => pos + d.movement === moveTo);
    return { nextMovePos: moveTo, direction: newDir || dir };
  }

  return { nextMovePos: pos, direction: dir };
};

/**
 * Inky moves to a position based on Blinky's and Pacman's position
 * @param {number} pos
 * @param {object} dir
 * @param {object} dto
 * @returns {{nextMovePos: number, direction: object}}
 */
export const inkyBehavior = (pos, dir, dto) => {
  const pacPos = dto.pacman.pos;
  const BlinkyPos = dto.ghostContext.ghosts.find(g => g.name === 'blinky').pos;
  let target = ((pacPos + BlinkyPos) / 2).toFixed(0);
  
  const path = findShortestPath(pos, target, dto);
    if (path && path.length > 0) {
    const moveTo = path[0];
    const newDir = Object.values(DIRECTIONS).find(d => pos + d.movement === moveTo);
    return { nextMovePos: moveTo, direction: newDir || dir };
  }

  return { nextMovePos: pos, direction: dir };
};

/**
 * Clyde follows Pacman if 8 or more spaces away, otherwise moves to up left corner
 * @param {number} pos
 * @param {object} dir
 * @param {object} dto
 * @returns {{nextMovePos: number, direction: object}}
 */
export const clydeBehavior = (pos, dir, dto) => {
  const pacPos = dto.pacman.pos;
  const shouldFollow = pacPos - pos > 8;

  let target = shouldFollow ? target = pacPos : target = 22; // Move to the top left corner if not following

  const path = findShortestPath(pos, target, dto);
  if (path && path.length > 0) {
    const moveTo = path[0];
    const newDir = Object.values(DIRECTIONS).find(d => pos + d.movement === moveTo);
    return { nextMovePos: moveTo, direction: newDir || dir };
  }

  return { nextMovePos: pos, direction: dir };
};