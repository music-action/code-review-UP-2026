# Sparse Matrix Implementation Strategies

## Context
For a tic-tac-toe game with variable grid size, we need to decide between dense and sparse matrix representations.

## Current Implementation (Dense Matrix)
```typescript
private _matrix: string[][] = [];
// Initialized as: Array(rows).fill(null).map(() => Array(cols).fill('_'))
```

**Characteristics:**
- Memory: O(rows × cols) - allocates all cells upfront
- Access time: O(1) - direct array indexing
- Best for: Small to medium grids where most cells get filled

## When to Consider Sparse Matrix

**Use cases:**
- Very large grids (50×50+)
- Games where most cells remain empty
- Memory-constrained environments

**Example:** 100×100 grid with only 20 moves uses 10,000 cells but only 20 are filled

## Strategy 1: Map with Composite String Key

```typescript
private _matrix: Map<string, string> = new Map();

setTile(row: number, col: number, symbol: string) {
    this._matrix.set(`${row},${col}`, symbol);
}

getTile(row: number, col: number): string {
    return this._matrix.get(`${row},${col}`) ?? '_';
}

readMatrixLine(rowNumber: number): string {
    let result = '';
    for (let col = 0; col < this._columns; col++) {
        result += this.getTile(rowNumber, col);
    }
    return result;
}

readMatrixColumn(colNumber: number): string {
    let result = '';
    for (let row = 0; row < this._rows; row++) {
        result += this.getTile(row, colNumber);
    }
    return result;
}
```

**Pros:**
- Simple implementation
- Easy to understand
- Works well for random access

**Cons:**
- String concatenation overhead for keys
- Harder to iterate efficiently over rows/columns
- Need to loop through all positions when reading lines

**Complexity:**
- Memory: O(filled cells)
- Access: O(1) average for hash lookup
- ReadLine/ReadColumn: O(grid dimension) always

## Strategy 2: Map of Maps (Nested Structure)

```typescript
private _matrix: Map<number, Map<number, string>> = new Map();

setTile(row: number, col: number, symbol: string) {
    if (!this._matrix.has(row)) {
        this._matrix.set(row, new Map());
    }
    this._matrix.get(row)!.set(col, symbol);
}

getTile(row: number, col: number): string {
    return this._matrix.get(row)?.get(col) ?? '_';
}

readMatrixLine(rowNumber: number): string {
    const row = this._matrix.get(rowNumber);
    if (!row || row.size === 0) {
        return '_'.repeat(this._columns);
    }

    let result = '';
    for (let col = 0; col < this._columns; col++) {
        result += row.get(col) ?? '_';
    }
    return result;
}

readMatrixColumn(colNumber: number): string {
    let result = '';
    for (let rowNum = 0; rowNum < this._rows; rowNum++) {
        result += this._matrix.get(rowNum)?.get(colNumber) ?? '_';
    }
    return result;
}

fillFullLine(rowNumber: number, tileSymbol: string) {
    const row = new Map<number, string>();
    for (let col = 0; col < this._columns; col++) {
        row.set(col, tileSymbol);
    }
    this._matrix.set(rowNumber, row);
}
```

**Pros:**
- Natural row-based operations
- Can skip entirely empty rows
- Easy to iterate over filled cells in a row

**Cons:**
- More complex initialization and null handling
- Column operations still require full iteration
- Two levels of Map lookups for access

**Complexity:**
- Memory: O(filled cells)
- Access: O(1) average (two hash lookups)
- ReadLine: O(columns) but faster if row is empty
- ReadColumn: O(rows) always

## Strategy 3: Custom Class with Encapsulation

```typescript
class SparseMatrix {
    private data: Map<string, string> = new Map();
    private rows: number;
    private cols: number;

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
    }

    private key(row: number, col: number): string {
        return `${row}:${col}`;
    }

    set(row: number, col: number, value: string): void {
        this.data.set(this.key(row, col), value);
    }

    get(row: number, col: number): string {
        return this.data.get(this.key(row, col)) ?? '_';
    }

    getRow(rowNumber: number): string {
        let result = '';
        for (let col = 0; col < this.cols; col++) {
            result += this.get(rowNumber, col);
        }
        return result;
    }

    getColumn(colNumber: number): string {
        let result = '';
        for (let row = 0; row < this.rows; row++) {
            result += this.get(row, colNumber);
        }
        return result;
    }
}

// Usage in GameHerve:
private _matrix: SparseMatrix;

setDimensions(rows: number, cols: number) {
    this._matrix = new SparseMatrix(rows, cols);
}
```

**Pros:**
- Encapsulates sparse matrix logic
- Cleaner separation of concerns
- Could swap implementations easily
- Testable in isolation

**Cons:**
- Additional class to maintain
- String key overhead still exists

## Strategy 4: Coordinate List (COO format)

```typescript
interface Cell {
    row: number;
    col: number;
    value: string;
}

private _cells: Cell[] = [];

setTile(row: number, col: number, symbol: string) {
    const existing = this._cells.findIndex(
        c => c.row === row && c.col === col
    );

    if (existing >= 0) {
        this._cells[existing].value = symbol;
    } else {
        this._cells.push({ row, col, value: symbol });
    }
}

getTile(row: number, col: number): string {
    const cell = this._cells.find(
        c => c.row === row && c.col === col
    );
    return cell?.value ?? '_';
}
```

**Pros:**
- Very memory efficient
- Simple structure
- Easy to serialize

**Cons:**
- Slow lookups: O(n) where n = filled cells
- Slow updates
- Only good for very sparse matrices with rare access

## Recommendation

### For this tic-tac-toe implementation:

**Stick with dense matrix** for grids up to 20×20
- Simple, fast, predictable
- Memory is negligible (400 cells = ~1KB)

**Use Strategy 2 (Map of Maps)** for grids 50×50+
- Good balance of complexity and performance
- Natural fit for row-based operations
- Easy migration path (same interface)

**Use Strategy 3 (Custom Class)** for production code
- Better encapsulation
- Easier testing
- Could start with dense and swap to sparse if needed

## Migration Path (TDD-friendly)

1. **Extract interface:**
   ```typescript
   interface IMatrix {
       set(row: number, col: number, value: string): void;
       get(row: number, col: number): string;
       getRow(row: number): string;
       getColumn(col: number): string;
   }
   ```

2. **Create implementations:**
   - `DenseMatrix implements IMatrix`
   - `SparseMatrix implements IMatrix`

3. **Inject dependency:**
   ```typescript
   private _matrix: IMatrix;

   setDimensions(rows: number, cols: number) {
       // Choose implementation based on grid size
       if (rows * cols < 1000) {
           this._matrix = new DenseMatrix(rows, cols);
       } else {
           this._matrix = new SparseMatrix(rows, cols);
       }
   }
   ```

4. **Tests remain unchanged** - they test the public interface!

## Performance Comparison

| Operation | Dense | Sparse (Strategy 2) |
|-----------|-------|---------------------|
| Memory (100×100, 20 filled) | 10,000 cells | 20 cells |
| Set tile | O(1) | O(1) |
| Get tile | O(1) | O(1) |
| Read line | O(cols) | O(cols) |
| Read column | O(rows) | O(rows) |
| Fill line | O(cols) | O(cols) |

**Conclusion:** For typical tic-tac-toe variants (up to 20×20), dense matrix wins on simplicity with negligible memory cost.
