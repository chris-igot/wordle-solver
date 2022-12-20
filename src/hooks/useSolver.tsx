import React, { useEffect, useState } from 'react';

export const ROWS = 6;
export const COLS = 5;

export enum Marks {
    UNMARKED,
    NOT_HERE,
    EXACT,
}

function useSolver() {
    const [_words, set_words] = useState<string[]>([]);
    const [_wordsUsed, set_wordsUsed] = useState<string[]>([]);
    const [_positions, set_positions] = useState<{
        [index: string]: number | Set<number>;
    }>({});
    const [_marks, set_marks] = useState<Marks[][]>([]);
    const [_ready, set_ready] = useState(false);

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

                set_ready(true);
                set_words(words);
            })
            .catch((err) => console.log(err));
    }, []);

    const reset = () => {
        set_marks(Array(6).fill(Array(5).fill(Marks.UNMARKED)));
        set_wordsUsed([]);
        set_positions({});
    };

    const markLetter = (mark: Marks, row: number, col: number) => {
        const newMarks = { ..._marks };

        newMarks[row][col] = mark;

        set_marks(newMarks);
        updatePositions();
    };

    const addWord = (word: string) => {
        const newWordsUsed = [..._wordsUsed];

        newWordsUsed.push(word);
        set_wordsUsed(newWordsUsed);
        updatePositions();
    };

    const removeWord = (word: string) => {
        const index = _wordsUsed.indexOf(word);

        if (index >= 0) {
            const newWordsUsed = [..._wordsUsed];

            newWordsUsed.splice(index, 1);
            set_wordsUsed(newWordsUsed);
            updatePositions();
        }

        return index;
    };

    const updatePositions = () => {
        const newPositions = { ..._positions };

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                switch (_marks[row][col]) {
                    case Marks.EXACT:
                        newPositions[_wordsUsed[row].at(col) as string] = col;
                        break;
                    case Marks.NOT_HERE:
                        if (newPositions[_wordsUsed[row].at(col) as string]) {
                            (
                                newPositions[
                                    _wordsUsed[row].at(col) as string
                                ] as Set<number>
                            ).add(col);
                        } else {
                            newPositions[_wordsUsed[row].at(col) as string] =
                                new Set([col]);
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        set_positions(newPositions);
    };

    const findWords = () => {
        const matches: string[] = [];

        for (let row = 0; row < _words.length; row++) {
            const word = _words[row];
            let found = true;

            for (let col = 0; col < COLS; col++) {
                const letter = word.at(col) as string;

                if (letter in _positions) {
                    const posData = _positions[letter];

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

    return { ready: _ready, reset, markLetter, addWord, removeWord, findWords };
}

export default useSolver;
