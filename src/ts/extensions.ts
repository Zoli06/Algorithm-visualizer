export {};

Math.getRandomArbitrary = function (min: number, max: number): number {
    return Math.random() * (max - min) + min;
}