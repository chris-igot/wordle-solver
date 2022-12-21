import React from 'react';
import { COLS, Marks } from '../hooks/useSolver';
import { TextField } from '@mui/material';

export interface PropsType {
    row: number;
    word: string;
    updateWord: (word: string, row: number) => void;
    letterStates: Marks[];
    toggleLetterState: (row: number, col: number) => void;
}

function Word(props: PropsType) {
    const indexStart = (props.row ? COLS * props.row : 0) + 1;
    const textArray = props.word ? props.word.split('') : Array(COLS).fill(' ');

    const markColor = (mark: Marks): React.CSSProperties => {
        let output: React.CSSProperties = {};
        switch (mark) {
            case Marks.NOT_HERE:
                output = { backgroundColor: 'darkgrey' };
                break;
            case Marks.EXACT:
                output = { backgroundColor: 'green', color: 'white' };
                break;
            case Marks.UNMARKED:
                output = {};
                break;
        }

        return output;
    };

    const focusNext = (index: number) => {
        const element = document.getElementById(
            'letter-' + index
        ) as HTMLInputElement;
        if (element) {
            element.focus();
        } else {
            (document.getElementById('letter-1') as HTMLInputElement).focus();
        }
    };

    const updateLetter = (newValue: string, index: number) => {
        const wordArr = [...textArray];

        wordArr[index] = newValue;
        const newWord = wordArr.join('');
        props.updateWord(newWord, props.row);
    };

    return (
        <div>
            {textArray.map((letter: string, col: number) => {
                return (
                    <TextField
                        key={col}
                        value={letter.toUpperCase()}
                        variant="outlined"
                        inputProps={{
                            id: 'letter-' + (indexStart + col),
                            tabIndex: indexStart + col,
                            maxLength: 1,
                            style: {
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                            },
                            onKeyUp: (e) => {
                                console.log(e.key);
                                if (e.key.length === 1) {
                                    updateLetter(e.key, col);
                                    focusNext(indexStart + col + 1);
                                }
                            },
                            onFocus: (e) => {
                                e.target.select();
                            },
                            onClick: (e) => {
                                const row = props.row ? props.row : 0;
                                props.toggleLetterState(row, col);
                            },
                        }}
                        sx={{
                            margin: '0.25rem',
                            width: '3.5rem',
                            height: '3.4rem',

                            ...markColor(props.letterStates[col]),
                        }}
                    />
                );
            })}
        </div>
    );
}

export default Word;
