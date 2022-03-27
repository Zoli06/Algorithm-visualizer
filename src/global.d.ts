export {};

declare global {
    interface Math {
        getRandomArbitrary(min: number, max: number): number;
    }
}