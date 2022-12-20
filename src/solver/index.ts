const ROWS = 6;
const COLS = 5;

enum Marks {
    UNMARKED,
    NOT_HERE,
    EXACT,
}

export default class Solver {
    private words: string[] = [];
    private wordsUsed: string[] = [];
    private positions: { [index: string]: number | Set<number> } = {};
    private marks: Marks[][];
    private ok = false;
    constructor(filename: string) {
        this.marks = Array(ROWS).fill(Array(COLS).fill(Marks.UNMARKED));
    }

    get ready() {
        return this.ok;
    }

    reset() {
        this.marks = Array(6).fill(Array(5).fill(Marks.UNMARKED));
        this.wordsUsed = [];
        this.positions = {};
    }

    async loadDictionary() {
        let words: string[] = [];

        fetch('./dictionary.txt', { method: 'get' })
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                console.log('data', data.length);
                this.words = [];

                for (let i = 0; i < data.length; i += 6) {
                    const word = data.substring(i, i + 6).trim();

                    this.words.push(word);
                }

                this.ok = true;
            })
            .catch((err) => console.log(err));

        this.words = words;
    }

    markLetter(mark: Marks, row: number, col: number) {
        this.marks[row][col] = mark;
        this.updatePositions();
    }

    addWord(word: string) {
        this.wordsUsed.push(word.toUpperCase());
        this.updatePositions();
    }

    removeWord(word: string) {
        const index = this.wordsUsed.indexOf(word);

        if (index >= 0) {
            this.wordsUsed.splice(index, 1);
        }
        this.updatePositions();

        return index;
    }

    private updatePositions() {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                switch (this.marks[row][col]) {
                    case Marks.EXACT:
                        this.positions[this.wordsUsed[row].at(col) as string] =
                            col;
                        break;
                    case Marks.NOT_HERE:
                        if (
                            this.positions[
                                this.wordsUsed[row].at(col) as string
                            ]
                        ) {
                            (
                                this.positions[
                                    this.wordsUsed[row].at(col) as string
                                ] as Set<number>
                            ).add(col);
                        } else {
                            this.positions[
                                this.wordsUsed[row].at(col) as string
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

        for (let row = 0; row < this.words.length; row++) {
            const word = this.words[row];
            let found = true;

            for (let col = 0; col < COLS; col++) {
                const letter = word.at(col) as string;

                if (letter in this.positions) {
                    const posData = this.positions[letter];

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
