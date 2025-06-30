import { DIRECTIONS, OBJECT_TYPE } from './setup';
import { blinkyBehavior, pinkyBehavior, inkyBehavior, clydeBehavior } from './ghostBehaviors';



class Ghost {
  constructor(
    speed = 5,
    startPos,
    behavior,
    name
  ) {
    this.name = name;
    this.startPos = startPos;
    this.pos = startPos;
    this.dir = DIRECTIONS.ArrowRight;
    this.speed = speed;
    this.timer = 0;
    this.isScared = false;
    this.rotation = false;
    this.behavior = behavior;
  }

  shouldMove() {
    if (this.timer === this.speed) {
      this.timer = 0;
      return true;
    }
    this.timer++;
  }

  getNextMove(dto) {
    const { nextMovePos, direction } = this.behavior(
      this.pos,
      this.dir,
      dto
    )
    return { nextMovePos, direction };
  }

  makeMove() {
    const classesToRemove = [OBJECT_TYPE.GHOST, OBJECT_TYPE.SCARED, this.name];
    let classesToAdd = [OBJECT_TYPE.GHOST, this.name];

    if (this.isScared) classesToAdd = [...classesToAdd, OBJECT_TYPE.SCARED];

    return { classesToRemove, classesToAdd };
  }


  setNewPos(nextMovePos, direction) {
    this.pos = nextMovePos;
    this.dir = direction;
  }
}

export default Ghost;