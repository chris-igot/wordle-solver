import React, { useEffect, useRef, useState } from 'react';
import { COLS } from '../solver';
import { TextField } from '@mui/material';

export interface PropsType {
    word?: string;
    row?: number;
    updateWord?: (word: string) => void;
}

function Word(props: PropsType) {
    const indexStart = (props.row ? COLS * props.row : 0) + 1;
    const textArray = props.word ? props.word.split('') : Array(COLS).fill(' ');

    const lettersRef = useRef(null);
    const [word, setWord] = useState<string>(
        props.word ? props.word : ' '.repeat(COLS)
    );

    useEffect(() => {
        console.log(word);
    }, [word]);

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

    const changeValue = (index: number, newValue: string) => {
        const wordArr = word.split('');
        wordArr[index] = newValue;
        const newWord = wordArr.join('');
        if (props.updateWord) {
            props.updateWord(newWord);
        }
        setWord(newWord);
    };

    return (
        <div ref={lettersRef}>
            {textArray.map((letter: string, col: number) => {
                return (
                    <TextField
                        key={col}
                        defaultValue={letter.toUpperCase()}
                        inputProps={{
                            id: 'letter-' + (indexStart + col),
                            tabIndex: indexStart + col,
                            maxLength: 1,
                            style: {
                                textAlign: 'center',
                                textTransform: 'uppercase',
                            },
                            onChange: (e) => {
                                changeValue(
                                    col,
                                    (e.target as HTMLInputElement).value
                                );
                                focusNext(indexStart + col + 1);
                            },
                            onFocus: (e) => {
                                e.target.select();
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
