import React, { useEffect, useState } from 'react';

export const ROWS = 6;
export const COLS = 5;

export enum Marks {
    UNMARKED,
    NOT_HERE,
    EXACT,
}

const generate2DArray = (rows: number, cols: number) => {
    const output: Marks[][] = [];

    for (let row = 0; row < rows; row++) {
        output.push(Array(5).fill(Marks.UNMARKED));
    }

    return output;
};

function useSolver() {
    const [words, setWords] = useState<string[]>([]);
    const [wordsUsed, setWordsUsed] = useState<string[]>([]);
    const [positions, setPositions] = useState<{
        [index: string]: number | Set<number>;
    }>({});
    const [marks, setMarks] = useState<Marks[][]>(generate2DArray(ROWS, COLS));
    const [ready, setReady] = useState(false);

    useEffect(() => {
        fetch('./dictionary.txt', { method: 'get' })
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                console.log('data', data.length);
                let words: string[] = [];

                for (let i = 0; i < data.length; i += 6) {
                    const word = data.substring(i, i + 6).trim();

                    words.push(word);
                }
                console.log(words);
                setReady(true);
                setWords(words);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        console.log(positions);
    }, [positions]);

    const reset = () => {
        setMarks(generate2DArray(ROWS, COLS));
        setWordsUsed([]);
        setPositions({});
    };

    const markLetter = (mark: Marks, row: number, col: number) => {
        const newMarks = { ...marks };
        console.log('markLetter', { mark, row, col });
        newMarks[row][col] = mark;

        setMarks(newMarks);
        updatePositions();
    };

    const addWord = (word: string) => {
        const newWordsUsed = [...wordsUsed];

        newWordsUsed.push(word.toUpperCase());
        setWordsUsed(newWordsUsed);
        updatePositions();
    };

    const removeWord = (word: string) => {
        const row = wordsUsed.indexOf(word);

        if (row >= 0) {
            const newWordsUsed = [...wordsUsed];

            newWordsUsed.splice(row, 1);
            setWordsUsed(newWordsUsed);
            updatePositions();
        }

        return row;
    };

    const updateWord = (newWord: string, row: number) => {
        const newWordsUsed = [...wordsUsed];

        if (row < newWordsUsed.length) {
            newWordsUsed[row] = newWord;
        }
    };

    const updatePositions = () => {
        const newPositions = { ...positions };

        for (let row = 0; row < wordsUsed.length; row++) {
            for (let col = 0; col < COLS; col++) {
                switch (marks[row][col]) {
                    case Marks.EXACT:
                        newPositions[wordsUsed[row].at(col) as string] = col;
                        break;
                    case Marks.NOT_HERE:
                        // console.log('99', wordsUsed[row], col);
                        if (
                            newPositions[
                                wordsUsed[row].at(col) as string
                            ] instanceof Set
                        ) {
                            (
                                newPositions[
                                    wordsUsed[row].at(col) as string
                                ] as Set<number>
                            ).add(col);
                        } else {
                            newPositions[wordsUsed[row].at(col) as string] =
                                new Set([col]);
                        }
                        break;
                    case Marks.UNMARKED:
                        // delete newPositions[wordsUsed[row].at(col) as string];
                        newPositions[wordsUsed[row].at(col) as string] = -1;
                        break;
                    default:
                        break;
                }
            }
        }

        setPositions(newPositions);
    };

    const findWords = () => {
        const matches: string[] = [];
        console.log('\n\n');
        if (Object.keys(positions).length > 0) {
            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                let ok = true;

                for (const letter in positions) {
                    const posData = positions[letter];

                    if (typeof posData === 'number') {
                        if (word.includes(letter)) {
                            if (posData < 0) {
                                ok = false;
                                break;
                            } else {
                                if (word.at(posData) !== letter) {
                                    ok = false;
                                    break;
                                }
                            }
                        } else {
                            if (posData >= 0) {
                                ok = false;
                                break;
                            }
                        }
                    } else {
                        for (const index of posData) {
                            if (word.at(index) === letter) {
                                ok = false;
                                break;
                            }

                            if (!word.includes(letter)) {
                                ok = false;
                                break;
                            }
                        }

                        if (!ok) {
                            ok = false;
                            break;
                        }
                    }
                }

                if (ok) {
                    matches.push(word);
                }
            }
        }
        console.log(
            matches,
            Object.keys(positions).length,
            wordsUsed,
            positions
        );
        return matches;
    };

    return {
        ready,
        wordsUsed,
        marks,
        reset,
        markLetter,
        addWord,
        removeWord,
        updateWord,
        findWords,
    };
}

export default useSolver;
