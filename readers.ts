import * as readline from 'readline-sync';
import { Vector2 } from 'three';

/**
 * Interface for reading input for object moving on plane
 */
export interface IReader<T> {
    /**
     * Reads dimensions and starting position
     */
    readInit(): { tableSize: Vector2, startPostition: Vector2 }
    /**
     * Reads commands to be executed
     */
    readCommands(): T[]
}

/**
 * Creates instance for reading number input from stdin
 */
export class IntReader implements IReader<number>{
    /**
     * Checks if provided array contains only numbers
     * @param arr Array to be checked
     */
    private checkInput(arr: string[], con = false) {
        for (const item of arr) {
            if (Number.isNaN(Number(item)) || con) {
                throw new Error('Invalid input');
            }
        }
    }

    public readInit(delimiter = ','): { tableSize: Vector2; startPostition: Vector2; } {
        const input = readline.question();
        const parsed = input.split(delimiter);
        this.checkInput(parsed, parsed.length !== 4);
        return {
            tableSize: new Vector2(Number(parsed[0]), Number(parsed[1])),
            startPostition: new Vector2(Number(parsed[2]), Number(parsed[3]))
        }

    }

    public readCommands(delimiter = ','): number[] {
        const input = readline.question();
        const parsed = input.split(delimiter);
        this.checkInput(parsed);
        return parsed.map(i => Number(i));
    }
}