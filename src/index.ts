import { IntReader } from './readers';
import { Grid, MovingObject } from './objects';
import { PlaneScene } from './scenes';

const reader = new IntReader();
const init = reader.readInit();
const commands = reader.readCommands();

const scene = new PlaneScene<MovingObject>(
    new Grid(init.tableSize.y, init.tableSize.x),
    new MovingObject(init.startPostition.x, init.startPostition.y, 0, -1),
    commands
);

// defines commands behaviour
const handlers = [];
handlers[1] = () => { scene.getObj().moveForward(); };
handlers[2] = () => { scene.getObj().moveBackwards(); };
handlers[3] = () => { scene.getObj().rotateClockwise(); };
handlers[4] = () => { scene.getObj().rotateCounterClockwise(); };
scene.simulate((err, res) => {
    if (err) {
        console.log([-1, -1]);
    }
    else console.log(res.toArray());
}, handlers);