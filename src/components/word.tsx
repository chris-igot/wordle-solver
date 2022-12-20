import React, { useEffect, useRef, useState } from 'react';
import { COLS, Marks } from '../hooks/useSolver';
import { TextField } from '@mui/material';

export interface PropsType {
    row: number;
    word: string;
    updateWord: (word: string) => void;
    letterStates: Marks[];
    toggleLetterState: (row: number, col: number) => void;
}

function Word(props: PropsType) {
    const indexStart = (props.row ? COLS * props.row : 0) + 1;
    const textArray = props.word ? props.word.split('') : Array(COLS).fill(' ');

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

    const updateWord = (index: number, newValue: string) => {
        const wordArr = [...textArray];
        wordArr[index] = newValue;
        const newWord = wordArr.join('');
        props.updateWord(newWord);
    };

    return (
        <div>
            {textArray.map((letter: string, col: number) => {
                return (
                    <TextField
                        key={col}
                        value={letter.toUpperCase()}
                        inputProps={{
                            id: 'letter-' + (indexStart + col),
                            tabIndex: indexStart + col,
                            maxLength: 1,
                            style: {
                                textAlign: 'center',
                                textTransform: 'uppercase',
                            },
                            onKeyUp: (e) => {
                                console.log(e.key);
                                if (e.key.length === 1) {
                                    updateWord(col, e.key);
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
                        }}
                    />
                );
            })}
        </div>
    );
}

export default Word;
