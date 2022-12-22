import { useEffect, useState } from 'react';

export const ROWS = 6;
export const COLS = 5;

export enum Marks {
    NA,
    EXACT,
    NOT_HERE,
    NOT_ANYWHERE,
}

function indexOfAll(text: string, substring: string) {
    let index = text.indexOf(substring, 0);
    let results = [];

    if (index >= 0) {
        results.push(index++);
    }

    while (index > 0) {
        index = text.indexOf(substring, index);
        if (index >= 0) {
            results.push(index++);
        }
    }

    return results;
}

const generate2DArray = (rows: number, cols: number) => {
    const output: Marks[][] = [];

    for (let row = 0; row < rows; row++) {
        output.push(Array(cols).fill(Marks.NOT_ANYWHERE));
    }

    return output;
};

function* offGen<T>(index: number, one: T, many: T, count: number) {
    for (let i = 0; i < count; i++) {
        if (i === index) {
            yield one;
        } else {
            yield many;
        }
    }
}

function generateArray(
    index: number,
    one: Marks = Marks.EXACT,
    many: Marks = Marks.NOT_ANYWHERE,
    count: number = COLS
) {
    return [...offGen(index, one, many, count)];
}

export interface PosDataType {
    [index: string]: false | Marks[];
}

function useSolver() {
    const [words, setWords] = useState<string[]>([]);
    const [wordsUsed, setWordsUsed] = useState<string[]>([]);
    const [positions, setPositions] = useState<PosDataType>({});
    const [marks, setMarks] = useState<Marks[][]>(generate2DArray(ROWS, COLS));
    const [ready, setReady] = useState(false);
    const [results, setResults] = useState<string[]>([]);

    useEffect(() => {
        fetch('./dictionary.txt', { method: 'get' })
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                let words: string[] = [];

                for (let i = 0; i < data.length; i += 6) {
                    const word = data.substring(i, i + 6).trim();

                    words.push(word);
                }

                setReady(true);
                setWords(words);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        updatePositions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marks, wordsUsed]);

    useEffect(() => {
        console.table(positions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [positions]);

    const reset = () => {
        setMarks(generate2DArray(ROWS, COLS));
        setWordsUsed([]);
        setPositions({});
    };

    const markLetter = (mark: Marks, row: number, col: number) => {
        const newMarks = { ...marks };
        const letter = wordsUsed[row].at(col) as string;
        const indices = indexOfAll(wordsUsed[row], letter);

        if (indices.length > 1) {
            for (let i = 0; i < indices.length; i++) {
                const c = indices[i];

                if (c !== col) {
                    if (
                        mark !== Marks.NOT_ANYWHERE &&
                        newMarks[row][c] !== Marks.EXACT
                    ) {
                        newMarks[row][c] = Marks.NOT_HERE;
                    }

                    if (mark === Marks.NOT_ANYWHERE) {
                        newMarks[row][c] = Marks.NOT_ANYWHERE;
                    }
                }
            }
        }

        newMarks[row][col] = mark;

        setMarks(newMarks);
    };

    const resetMarkedRow = (row: number) => {
        const newMarks = { ...marks };

        newMarks[row] = Array(COLS).fill(Marks.NOT_ANYWHERE);

        setMarks(newMarks);
    };

    const addWord = (word: string) => {
        const newWordsUsed = [...wordsUsed];

        newWordsUsed.push(word.toUpperCase());
        setWordsUsed(newWordsUsed);
    };

    const removeWord = (word: string) => {
        const row = wordsUsed.indexOf(word.toUpperCase());

        if (row >= 0) {
            const newWordsUsed = [...wordsUsed];

            newWordsUsed.splice(row, 1);
            setWordsUsed(newWordsUsed);
            resetMarkedRow(row);
            setPositions({});
        }

        return row;
    };

    const updateWord = (newWord: string, row: number) => {
        const newWordsUsed = [...wordsUsed];

        if (row < newWordsUsed.length) {
            newWordsUsed[row] = newWord.toUpperCase();
        }

        setWordsUsed(newWordsUsed);
        resetMarkedRow(row);
        setPositions({});
    };

    const updatePositions = () => {
        const newPositions = { ...positions };

        for (let row = 0; row < wordsUsed.length; row++) {
            for (let col = 0; col < COLS; col++) {
                const isArray = Array.isArray(
                    newPositions[wordsUsed[row].at(col) as string]
                );

                console.log(
                    `marks[${row}][${col}]`,
                    marks[row][col],
                    wordsUsed[row].at(col),
                    newPositions[wordsUsed[row].at(col) as string],
                    isArray
                );

                switch (marks[row][col]) {
                    case Marks.EXACT:
                    case Marks.NOT_HERE:
                        console.log('NOT_HERE');
                        if (isArray) {
                            console.log('---change array');
                            (
                                newPositions[
                                    wordsUsed[row].at(col) as string
                                ] as Marks[]
                            )[col] = marks[row][col];
                        } else {
                            console.log('---new array');
                            newPositions[wordsUsed[row].at(col) as string] =
                                generateArray(col, marks[row][col]);
                        }

                        break;
                    case Marks.NOT_ANYWHERE:
                        console.log('NOT_ANYWHERE');
                        newPositions[wordsUsed[row].at(col) as string] = false;
                        break;
                    default:
                        console.log('---default');
                        break;
                }
            }
        }
        console.table(newPositions);
        setPositions(newPositions);
    };

    const findWords = () => {
        const matches = words.filter((word) => {
            for (const letter in positions) {
                const posData = positions[letter];
                const includesLetter = word.includes(letter);

                if (posData === false) {
                    if (includesLetter) {
                        return false;
                    }
                } else {
                    if (!includesLetter) {
                        return false;
                    }

                    for (let mIndex = 0; mIndex < posData.length; mIndex++) {
                        switch (posData[mIndex]) {
                            case Marks.EXACT:
                                if (word.at(mIndex) !== letter) {
                                    return false;
                                }
                                break;
                            case Marks.NOT_HERE:
                                if (word.at(mIndex) === letter) {
                                    return false;
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }
            }

            return true;
        });

        setResults(matches);
        return matches;
    };

    return {
        ready,
        wordOptions: words.map((label) => ({ label })),
        wordsUsed,
        marks,
        positions,
        reset,
        markLetter,
        addWord,
        removeWord,
        updateWord,
        findWords,
        results,
    };
}

export default useSolver;
