import {GameHerve} from "./gameHerve";

describe('readMatrixColumn', () => {
    let game: GameHerve;

    beforeEach(() => {
        game = new GameHerve();
        game.setDimensions(3, 3);
    });

    test('empty column returns ___', () => {
        const result = game.readMatrixColumn(0);

        expect(result).toBe('___');
    });

    test('column filled with X returns XXX', () => {
        game.fillFullColumn(1, 'X');

        const result = game.readMatrixColumn(1);

        expect(result).toBe('XXX');
    });

    test('column filled with O returns OOO', () => {
        game.fillFullColumn(2, 'O');

        const result = game.readMatrixColumn(2);

        expect(result).toBe('OOO');
    });

    test('partially filled column returns correct pattern', () => {
        game.setTile(0, 0, 'X');
        game.setTile(1, 0, 'O');
        game.setTile(2, 0, 'X');

        const result = game.readMatrixColumn(0);

        expect(result).toBe('XOX');
    });
});
