import React, { useEffect, useState } from 'react';

export const ROWS = 6;
export const COLS = 5;

export enum Marks {
    UNMARKED,
    NOT_HERE,
    EXACT,
}

function useSolver() {
    const [words, setWords] = useState<string[]>([]);
    const [wordsUsed, setWordsUsed] = useState<string[]>([]);
    const [positions, setPositions] = useState<{
        [index: string]: number | Set<number>;
    }>({});
    const [marks, setMarks] = useState<Marks[][]>([]);
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

                setReady(true);
                setWords(words);
            })
            .catch((err) => console.log(err));
    }, []);

    const reset = () => {
        setMarks(Array(6).fill(Array(5).fill(Marks.UNMARKED)));
        setWordsUsed([]);
        setPositions({});
    };

    const markLetter = (mark: Marks, row: number, col: number) => {
        const newMarks = { ...marks };

        newMarks[row][col] = mark;

        setMarks(newMarks);
        updatePositions();
    };

    const addWord = (word: string) => {
        const newWordsUsed = [...wordsUsed];

        newWordsUsed.push(word);
        setWordsUsed(newWordsUsed);
        updatePositions();
    };

    const removeWord = (word: string) => {
        const index = wordsUsed.indexOf(word);

        if (index >= 0) {
            const newWordsUsed = [...wordsUsed];

            newWordsUsed.splice(index, 1);
            setWordsUsed(newWordsUsed);
            updatePositions();
        }

        return index;
    };

    const updatePositions = () => {
        const newPositions = { ...positions };

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                switch (marks[row][col]) {
                    case Marks.EXACT:
                        newPositions[wordsUsed[row].at(col) as string] = col;
                        break;
                    case Marks.NOT_HERE:
                        if (newPositions[wordsUsed[row].at(col) as string]) {
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
                    default:
                        break;
                }
            }
        }

        setPositions(newPositions);
    };

    const findWords = () => {
        const matches: string[] = [];

        for (let row = 0; row < words.length; row++) {
            const word = words[row];
            let found = true;

            for (let col = 0; col < COLS; col++) {
                const letter = word.at(col) as string;

                if (letter in positions) {
                    const posData = positions[letter];

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
        findWords,
    };
}

export default useSolver;
