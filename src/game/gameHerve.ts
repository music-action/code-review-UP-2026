// @ts-nocheck
class GameResult {
    isWinner: boolean = false;
    winner: string = '';
}

export class GameHerve {
    private _columns: number = 0;
    private _rows: number = 0;
    private _winningStreak: number = 0;
    private _matrix: string[][] = [];


    setDimensions(rows: number, column: number) {
        this._columns = column;
        this._rows = rows;
        this._matrix = Array(rows).fill(null).map(() => Array(column).fill('_'));
    }

    setWinningStreak(winningStreak: number) {
        this._winningStreak = winningStreak;
    }


    fillFullLine(rowNumber: number, tileSymbol: string) {
        for (let col = 0; col < this._columns; col++) {
            this._matrix[rowNumber][col] = tileSymbol;
        }
    }

    fillFullColumn(colNumber: number, symbol: string) {
        for (let row = 0; row < this._rows; row++) {
            this._matrix[row][colNumber] = symbol;
        }
    }

    VerifyLine(rowNumber: number): GameResult {
        let result = new GameResult();
        let winningSymbol = this.containsOnlyTheSameSymbol(this.readMatrixLine(rowNumber));
        result.isWinner = winningSymbol;
        result.winner = this.readMatrixLine(rowNumber)[0]  ;
        return result;
    }

    VerifyColumn(columnNumber: number) {
        let result = new GameResult();
        let winningSymbol = this.containsOnlyTheSameSymbol(this.readMatrixColumn(columnNumber));
        result.isWinner = winningSymbol;
        result.winner = this.readMatrixColumn(columnNumber)[0]  ;
        return result;
    }

    containsOnlyTheSameSymbol(fullLine: string): boolean {
        return fullLine.split('').reduce((acc, curr, idx) => {
            if (idx === 0) return curr !== '_'; // First char must not be empty
            return acc && curr === fullLine[0]; // All must match first char
        }, true);
    }


    readMatrixLine(rowNumber: number): string {
        return this._matrix[rowNumber].reduce((acc, curr) => acc + curr);
    }

    readMatrixColumn(colNumber: number): string {
        return this._matrix.reduce((acc, row) => acc + row[colNumber], '');
    }

    setTile(row: number, column: number, symbol: string) {
        this._matrix[row][column] = symbol;
    }



}