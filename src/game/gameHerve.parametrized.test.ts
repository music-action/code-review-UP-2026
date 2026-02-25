import {GameHerve} from "./gameHerve";

describe('Parametrized game tests', () => {
    let game: GameHerve;

    beforeEach(() => {
        game = new GameHerve();
    });

    describe.each([
        ['X'],
        ['O']
    ])('with symbol %s', (symbol) => {

        test.each([0, 1, 2])('row %i filled is winning', (rowNumber) => {
            game.setDimensions(3, 3);
            game.setWinningStreak(3);
            game.fillFullLine(rowNumber, symbol);

            const result = game.VerifyLine(rowNumber);

            expect(result.isWinner).toBe(true);
            expect(result.winner).toBe(symbol);
        });

        test.each([0, 1, 2])('column %i filled is winning', (colNumber) => {
            game.setDimensions(3, 3);
            game.setWinningStreak(3);
            game.fillFullColumn(colNumber, symbol);

            const result = game.VerifyColumn(colNumber);

            expect(result.isWinner).toBe(true);
            expect(result.winner).toBe(symbol);
        });
    });

    describe.each([
        [2, 2],
        [10, 10]
    ])('with grid size %ix%i', (rows, cols) => {

        test('filling first row creates winning line', () => {
            game.setDimensions(rows, cols);
            game.setWinningStreak(cols);
            game.fillFullLine(0, 'X');

            const result = game.VerifyLine(0);

            expect(result.isWinner).toBe(true);
            expect(result.winner).toBe('X');
        });

        test('filling first column creates winning column', () => {
            game.setDimensions(rows, cols);
            game.setWinningStreak(rows);
            game.fillFullColumn(0, 'O');

            const result = game.VerifyColumn(0);

            expect(result.isWinner).toBe(true);
            expect(result.winner).toBe('O');
        });

        test('empty line is not winning', () => {
            game.setDimensions(rows, cols);
            game.setWinningStreak(cols);

            const result = game.VerifyLine(0);

            expect(result.isWinner).toBe(false);
        });
    });

    describe.each([
        ['X', 'O'],
        ['O', 'X']
    ])('mixed symbols: %s and %s', (symbol1, symbol2) => {

        test('line with both symbols is not winning', () => {
            game.setDimensions(3, 3);
            game.setWinningStreak(3);
            game.fillFullLine(0, symbol1);
            game.setTile(0, 1, symbol2);

            const result = game.VerifyLine(0);

            expect(result.isWinner).toBe(false);
        });

        test('column with both symbols is not winning', () => {
            game.setDimensions(3, 3);
            game.setWinningStreak(3);
            game.fillFullColumn(0, symbol1);
            game.setTile(1, 0, symbol2);

            const result = game.VerifyColumn(0);

            expect(result.isWinner).toBe(false);
        });
    });
});
