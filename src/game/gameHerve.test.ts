import {GameHerve} from "./gameHerve";

describe('unknown game', () => {
    let game: GameHerve;

    beforeEach(() => {
        game = new GameHerve();
    });



    test('line one is winning', () => {
        //arrange
        game.setDimensions(3, 3);
        game.setWinningStreak(3);

        game.fillFullLine( 1, 'X');

        //act

        const result = game.VerifyLine(1);

        expect( result.isWinner ).toBe(true);
        expect( result.winner ).toBe('X');
    });


    test('line 0 is loosing', () => {
        //arrange
        game.setDimensions(3, 3);
        game.setWinningStreak(3);

        game.fillFullLine( 1, 'X');

        //act

        const result = game.VerifyLine(0);

        expect( result.isWinner ).toBe(false);
        expect( result.winner ).toBe('_');
    });



    test('line 3 is winning with O', () => {
        //arrange
        game.setDimensions(3, 3);
        game.setWinningStreak(3);

        game.fillFullLine( 2, 'O');

        //act

        const result = game.VerifyLine(2);

        expect( result.isWinner ).toBe(true);
        expect( result.winner ).toBe('O');
    });


    test('line 3 is loosing with OXO', () => {
        //arrange
        game.setDimensions(3, 3);
        game.setWinningStreak(3);

        game.fillFullLine( 2, 'O');
        game.setTile( 2 ,1 ,'X')

        //act

        const result = game.VerifyLine(2);

        expect( result.isWinner ).toBe(false);
    });

    test('column one is winning', () => {
        //arrange
        game.setDimensions(3, 3);
        game.setWinningStreak(3);

        game.fillFullColumn( 1, 'X');

        //act

        const result = game.VerifyColumn(1);

        expect( result.isWinner ).toBe(true);
        expect( result.winner ).toBe('X');
    });


    test('column two is loosing', () => {
        //arrange
        game.setDimensions(3, 3);
        game.setWinningStreak(3);

        game.fillFullColumn( 1, 'X');
        game.setTile( 1 ,1 ,'O');
        //act

        const result = game.VerifyColumn(1);

        expect( result.isWinner ).toBe(false);
    });

});