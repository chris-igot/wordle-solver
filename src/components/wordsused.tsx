import React from 'react';
import { COLS, Marks, PosDataType } from '../hooks/useSolver';
import { Box, Divider, List, ListItem, TextField } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';

export interface PropsType {
    solver: {
        ready: boolean;
        wordsUsed: string[];
        marks: Marks[][];
        positions: PosDataType;
        reset: () => void;
        markLetter: (mark: Marks, row: number, col: number) => void;
        addWord: (word: string) => void;
        removeWord: (word: string) => number;
        updateWord: (newWord: string, row: number) => void;
        findWords: () => string[];
        results: string[];
    };
    activateSnakeBar: (message: string) => void;
}

function WordsUsed(props: PropsType) {
    return (
        <Box>
            <List>
                <Divider />
                {props.solver.wordsUsed.map((word, row) => (
                    <React.Fragment key={row}>
                        <ListItem>
                            <TextField
                                defaultValue={word}
                                inputProps={{
                                    maxLength: COLS,
                                    onKeyUp: (e) => {
                                        const newWord =
                                            e.currentTarget.value.toUpperCase();

                                        if (
                                            e.key === 'Enter' &&
                                            newWord.length === COLS
                                        ) {
                                            props.solver.updateWord(
                                                newWord,
                                                row
                                            );

                                            props.activateSnakeBar(
                                                `${word} has been changed to ${newWord}`
                                            );
                                            e.currentTarget.value = newWord;
                                        }
                                    },
                                }}
                            />

                            <DeleteForever
                                color="error"
                                onClick={() => {
                                    props.solver.removeWord(word);
                                }}
                                sx={{
                                    marginInlineStart: '1rem',
                                    float: 'right',
                                }}
                            />
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
}

export default WordsUsed;
