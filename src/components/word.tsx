import React, { useEffect } from 'react';
import { COLS } from '../solver';
import { TextField } from '@mui/material';

export interface PropsType {
    word?: string;
    index?: number;
}

function Word(props: PropsType) {
    const indexStart = (props.index ? COLS * props.index : 0) + 1;

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
    return (
        <div>
            {props.word
                ? props.word.split('').map((letter: string, index: number) => {
                      return (
                          <TextField
                              key={index}
                              defaultValue={letter.toUpperCase()}
                              inputProps={{
                                  id: 'letter-' + (indexStart + index),
                                  tabIndex: indexStart + index,
                                  maxLength: 1,
                                  style: { textAlign: 'center' },
                                  onChange: (e) => {
                                      focusNext(indexStart + index + 1);
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
                  })
                : Array(COLS)
                      .fill('')
                      .map((letter: string, index: number) => {
                          return (
                              <TextField
                                  key={index}
                                  defaultValue={letter}
                                  inputProps={{
                                      id: 'letter-' + (indexStart + index),
                                      tabIndex: indexStart + index,
                                      maxLength: 1,
                                      style: { textAlign: 'center' },
                                      onChange: (e) => {
                                          focusNext(indexStart + index + 1);
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
