import { Vector2 } from 'three';
import { PlaneObject, Grid } from './objects';

export class PlaneScene<T extends PlaneObject> {
    private grid: Grid;
    private obj: T;
    private commands: number[];

    /**
     * Creates a plane scene, where an object is supposed to move on a Grid
     */
    constructor(grid: Grid, obj: T, commnads: number[]) {
        this.grid = grid;
        // by default oriented to north
        this.obj = obj;
        this.commands = commnads
    }

    /**
     * Returns grid
     */
    public getGrid(): Grid {
        return this.grid;
    }

    /**
     * Returns moving object
     */
    public getObj(): T {
        return this.obj;
    }

    /**
     * Executes the set of commands and simulates movement on a grid
     * Process is non-blocking and output is available in the callback function
     * @param cb Called in the and of process
     * @param handlers Set of commands
     */
    public simulate(cb: (err: Error | undefined, result: Vector2) => void,
        handlers: CallableFunction[]): void {
        new Promise((resolve, reject) => {
            const entries = this.commands.entries();
            for (const [i, c] of entries) {
                // if object fell from grid, simulation end with error
                if (!this.grid.isInside(this.obj.getPosition())) {
                    reject(new Error('Object fell from plane'));
                    break;
                }
                // index 0 is resereved for simulation end
                if (c === 0) {
                    resolve();
                    break;
                }
                // executes command if it is defined in handlers array
                handlers[c]?.();
                // when array has been interated
                if (i + 1 === this.commands.length) {
                    resolve();
                    break;
                }
            }
            // if object fell from grid, simulation end with error
            if (!this.grid.isInside(this.obj.getPosition())) {
                reject(new Error('Object fell from plane'));
            }
        })
            .then(() => {
                cb(undefined, this.obj.getPosition());
            }).catch((err) => {
                cb(err, this.obj.getPosition());
            });
    }
}