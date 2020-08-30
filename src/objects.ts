import { Vector2 } from 'three';
import { Matrix, matrix, ones } from 'mathjs';

declare type MatrixValue = 0 | 1;
export abstract class PlaneObject {
    protected position: Vector2;
    protected rotation: Vector2;

    /**
     * Creates two dimensional object with position and height properties
     * Position origin [0, 0] is in top left corner 
     */
    constructor(posX: number = 0, posY: number = 0, rotX: number = 0, rotY: number = 0) {
        this.position = new Vector2(posX, posY);
        this.rotation = new Vector2(rotX, rotY);
    }

    /**
     * Sets new rotation to the object, enables setting any direction
     * @param rotation New rotation
     */
    public setRotation(rotation: Vector2): void {
        this.rotation = rotation;
    }

    /**
     * Rotates object for specified angle around its center
     * @param angle Angle in degrees
     */
    public rotate(angle: number) {
        this.rotation.rotateAround(new Vector2(), angle * Math.PI / 180).round();
        // round function might give -0 value
        if (this.rotation.x === -0) this.rotation.x = 0;
        if (this.rotation.y === -0) this.rotation.y = 0;
    }

    /**
     * Sets new position to the object
     * @param position New position
     */
    public setPostition(position: Vector2): void {
        this.position = position;
    }

    /**
     * Returns current position of the object
     */
    public getPosition(): Vector2 {
        return this.position;
    }

    /**
     * Returns current rotation of the object
     */
    public getRotation(): Vector2 {
        return this.rotation;
    }

    /**
     * Rotates the object clocwise for 90 deg
     */
    public rotateClockwise(): void {
        this.rotate(90);
    }

    /**
     * Rotates the object counterclocwise for 90 deg
     */
    public rotateCounterClockwise(): void {
        this.rotate(-90);
    }

    /**
     * Adds specified vector to the position attribute
     * @param vector Vector to be added
     */
    public move(vector: Vector2): void {
        this.position.add(vector);
    }

    /**
     * Movec object to right
     * @param value Number of steps
     */
    public moveRight(value: number = 1) {
        this.move(new Vector2(value, 0));
    }

    /**
     * Movec object to left
     * @param value Number of steps
     */
    public moveLeft(value: number = 1) {
        this.move(new Vector2(-value, 0));
    }

    /**
     * Movec object up
     * @param value Number of steps
     */
    public moveUp(value: number = 1) {
        this.move(new Vector2(0, -value));
    }

    /**
     * Movec object to down
     * @param value Number of steps
     */
    public moveDown(value: number = 1) {
        this.move(new Vector2(0, value));
    }
}

/**
 * Creates plane object with additional functions
 */
export class MovingObject extends PlaneObject {
    /**
     * Moves the object for specified number of steps in direction of its rotation
     * @param value Number of steps
     */
    public moveForward(value = 1) {
        // needs to work with copy/clone of rotation, otherwise it gets modified
        this.position.add(this.rotation.clone().multiplyScalar(value));
    }

    /**
     * Moves the object for specified number of steps in counter direction of its rotation
     * @param value Number of steps
     */
    public moveBackwards(value = -1) {
        this.position.add(this.rotation.clone().multiplyScalar(value));
    }
}

export class Grid {
    private matrix: Matrix;
    /**
     * Creates instance with property of matrix from mathjs
     * All matrix functions are avaiable via getMatric function
     */
    constructor(heigt = 0, width = 0) {
        this.matrix = ones(heigt, width) as Matrix;
    }

    /**
     * Creates sparse (irregular) matrix, enables setting custom grid shape
     * @param data Matrix shape, each array is one row, o represents empty cell, 1 represents full cell
     */
    public setShape(data: MatrixValue[] | MatrixValue[][]): this {
        this.matrix = matrix(data, 'sparse');
        return this;
    }

    /**
     * Returns matrix
     */
    public getMatrix(): Matrix {
        return this.matrix;
    }

    /**
     * Swaps indices x and y
     */
    public getValue(x: number, y: number): number[] {
        return this.matrix.get([y, x]);
    }

    /**
     * Checks if specified position is inside of matrix
     */
    public isInside(position: Vector2): boolean {
        const { x, y } = position;
        const size = this.matrix.size();
        const width = size[1];
        const height = size[0];
        // check if indices are in correct range
        if (x < 0 || y < 0 || x > width - 1 || y > height - 1) return false;
        return !!this.getValue(x, y);
    }
}