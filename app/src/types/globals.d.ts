export { };

declare global {
    interface BigInt {
        toJSON(): Number;
    }
}
