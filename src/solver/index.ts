export const ROWS = 6;
export const COLS = 5;

export enum Marks {
    UNMARKED,
    NOT_HERE,
    EXACT,
}

export default class Solver {
    private _words: string[] = [];
    private _wordsUsed: string[] = [];
    private _positions: { [index: string]: number | Set<number> } = {};
    private _marks: Marks[][];
    private _ready = false;
    constructor(filename: string) {
        this._marks = Array(ROWS).fill(Array(COLS).fill(Marks.UNMARKED));
    }

    get ready() {
        return this._ready;
    }

    get wordsUsed() {
        return this._wordsUsed;
    }

    reset() {
        this._marks = Array(6).fill(Array(5).fill(Marks.UNMARKED));
        this._wordsUsed = [];
        this._positions = {};
    }

    async loadDictionary() {
        let words: string[] = [];

        fetch('./dictionary.txt', { method: 'get' })
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                console.log('data', data.length);
                this._words = [];

                for (let i = 0; i < data.length; i += 6) {
                    const word = data.substring(i, i + 6).trim();

                    this._words.push(word);
                }

                this._ready = true;
            })
            .catch((err) => console.log(err));

        this._words = words;
    }

    markLetter(mark: Marks, row: number, col: number) {
        this._marks[row][col] = mark;
        this.updatePositions();
    }

    addWord(word: string) {
        this._wordsUsed.push(word.toUpperCase());
        this.updatePositions();
    }

    removeWord(word: string) {
        const index = this._wordsUsed.indexOf(word);

        if (index >= 0) {
            this._wordsUsed.splice(index, 1);
        }
        this.updatePositions();

        return index;
    }

    private updatePositions() {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                switch (this._marks[row][col]) {
                    case Marks.EXACT:
                        this._positions[
                            this._wordsUsed[row].at(col) as string
                        ] = col;
                        break;
                    case Marks.NOT_HERE:
                        if (
                            this._positions[
                                this._wordsUsed[row].at(col) as string
                            ]
                        ) {
                            (
                                this._positions[
                                    this._wordsUsed[row].at(col) as string
                                ] as Set<number>
                            ).add(col);
                        } else {
                            this._positions[
                                this._wordsUsed[row].at(col) as string
                            ] = new Set([col]);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    findWords() {
        const matches: string[] = [];

        for (let row = 0; row < this._words.length; row++) {
            const word = this._words[row];
            let found = true;

            for (let col = 0; col < COLS; col++) {
                const letter = word.at(col) as string;

                if (letter in this._positions) {
                    const posData = this._positions[letter];

                    if (typeof posData === 'number') {
                        if (posData !== col) {
                            found = false;
                            break;
                        }
                    } else {
                        if (posData.has(col)) {
                            found = false;
                            break;
                        }
                    }
                } else {
                    found = false;
                    break;
                }
            }

            if (found) {
                matches.push(word);
            }
        }
    }
}
