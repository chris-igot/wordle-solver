import React, { useEffect, useState } from 'react';
import './App.css';
import useSolver, { COLS, Marks } from './hooks/useSolver';
import Word from './components/word';
import {
    Box,
    Button,
    ButtonGroup,
    Collapse,
    Divider,
    Grow,
    List,
    ListItem,
    ListItemText,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import WordsUsed from './components/wordsused';

function App() {
    const solver = useSolver();

    const [edit, setEdit] = useState(false);
    const [snackBar, setSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');

    useEffect(() => {
        solver.findWords();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [solver.positions, solver.wordsUsed]);

    const toggle = (row: number, col: number) => {
        switch (solver.marks[row][col]) {
            case Marks.UNMARKED:
                solver.markLetter(Marks.NOT_HERE, row, col);
                break;
            case Marks.NOT_HERE:
                solver.markLetter(Marks.EXACT, row, col);
                break;
            case Marks.EXACT:
                solver.markLetter(Marks.UNMARKED, row, col);
                break;
        }
    };

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const element = document.getElementById(
            'word-input'
        ) as HTMLInputElement;

        if (element.value.length === COLS) {
            const word = element.value.trim();
            solver.addWord(word);
            element.value = '';
        }
    };

    const activateSnakeBar = (message: string) => {
        setSnackBarMessage(message);
        setSnackBar(true);
    };

    return (
        <div className="App">
            <Grow in={true} appear={true}>
                <Paper className="content" elevation={3}>
                    <Typography variant="h4" className="title">
                        Wordle Solver
                    </Typography>

                    <Collapse in={edit}>
                        <WordsUsed
                            solver={solver}
                            activateSnakeBar={activateSnakeBar}
                        />
                    </Collapse>

                    <Collapse in={!edit}>
                        <div id="words-used" className="words-used">
                            <TransitionGroup>
                                {solver.wordsUsed.map((word, row) => (
                                    <Collapse key={row}>
                                        <Word
                                            row={row}
                                            word={word}
                                            updateWord={solver.updateWord}
                                            letterStates={solver.marks[row]}
                                            toggleLetterState={toggle}
                                        />
                                    </Collapse>
                                ))}
                            </TransitionGroup>
                        </div>
                    </Collapse>

                    {solver.wordsUsed.length > 0 && (
                        <ButtonGroup
                            variant="outlined"
                            className="controls"
                            fullWidth={true}
                        >
                            <Button
                                color="warning"
                                onClick={() => {
                                    solver.reset();
                                    setEdit(false);
                                }}
                            >
                                Reset
                            </Button>
                            <Button
                                color="primary"
                                onClick={() => setEdit(!edit)}
                            >
                                {edit ? 'Normal Mode' : 'Edit Mode'}
                            </Button>
                        </ButtonGroup>
                    )}

                    <Collapse in={!edit}>
                        <form onSubmit={submitHandler}>
                            <TextField
                                id="word-input"
                                className="word-input"
                                placeholder="add word"
                                inputProps={{
                                    maxLength: COLS,
                                    style: {
                                        textAlign: 'center',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                    },
                                }}
                            />
                        </form>

                        <Typography className="divider" variant="caption">
                            {solver.results.length > 0
                                ? 'results'
                                : 'no results'}
                        </Typography>

                        <Box className="results">
                            <List>
                                {solver.results.length > 0 && <Divider />}
                                <TransitionGroup>
                                    {solver.results
                                        .slice(0, 20)
                                        .map((word, index) => (
                                            <Collapse key={index}>
                                                <ListItem>
                                                    <ListItemText
                                                        primary={word}
                                                    />
                                                </ListItem>
                                                <Divider />
                                            </Collapse>
                                        ))}
                                </TransitionGroup>
                                {solver.results.length > 20 && (
                                    <Typography
                                        className="divider"
                                        variant="caption"
                                    >
                                        maximum of 20 results shown
                                    </Typography>
                                )}
                            </List>
                        </Box>
                    </Collapse>
                </Paper>
            </Grow>

            <Snackbar
                open={snackBar}
                autoHideDuration={3000}
                message={snackBarMessage}
                onClose={() => {
                    setSnackBar(false);
                    setSnackBarMessage('');
                }}
            />
        </div>
    );
}

export default App;
