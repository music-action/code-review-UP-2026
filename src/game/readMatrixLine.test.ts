import {GameHerve} from "./gameHerve";

describe('readMatrixLine', () => {
    let game: GameHerve;

    beforeEach(() => {
        game = new GameHerve();
        game.setDimensions(3, 3);
    });

    test('empty line returns empty string', () => {
        const result = game.readMatrixLine(0);

        expect(result).toBe('___');
    });

    test('line filled with X returns XXX', () => {
        game.fillFullLine(1, 'X');

        const result = game.readMatrixLine(1);

        expect(result).toBe('XXX');
    });

    test('line filled with O returns OOO', () => {
        game.fillFullLine(2, 'O');

        const result = game.readMatrixLine(2);

        expect(result).toBe('OOO');
    });

});
