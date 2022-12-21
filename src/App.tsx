import React, { useEffect, useState } from 'react';
import './App.css';
import useSolver, { COLS, Marks } from './hooks/useSolver';
import Word from './components/word';
import {
    Box,
    Button,
    ButtonGroup,
    Divider,
    List,
    ListItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { DeleteForever } from '@mui/icons-material';

function App() {
    const solver = useSolver();

    const [edit, setEdit] = useState(false);

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

    return (
        <div className="App">
            <Paper className="content" elevation={3}>
                <Typography variant="h4" className="title">
                    Wordle Solver
                </Typography>

                {edit && (
                    <Box>
                        <List>
                            <Divider />
                            {solver.wordsUsed.map((word, row) => (
                                <React.Fragment key={row}>
                                    <ListItem>
                                        <TextField
                                            defaultValue={word}
                                            inputProps={{
                                                maxLength: COLS,
                                                onKeyUp: (e) => {
                                                    const word =
                                                        e.currentTarget.value;

                                                    if (
                                                        e.key === 'Enter' &&
                                                        word.length === COLS
                                                    ) {
                                                        solver.updateWord(
                                                            word,
                                                            row
                                                        );
                                                    }
                                                },
                                            }}
                                        />

                                        <DeleteForever
                                            color="error"
                                            onClick={() => {
                                                solver.removeWord(word);
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
                )}

                {!edit && (
                    <div id="words-used" className="words-used">
                        {solver.wordsUsed.map((word, row) => (
                            <Word
                                key={row}
                                row={row}
                                word={word}
                                updateWord={solver.updateWord}
                                letterStates={solver.marks[row]}
                                toggleLetterState={toggle}
                            />
                        ))}
                    </div>
                )}

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
                            }}
                        >
                            Reset
                        </Button>
                        <Button color="primary" onClick={() => setEdit(!edit)}>
                            {edit ? 'Normal Mode' : 'Edit Mode'}
                        </Button>
                    </ButtonGroup>
                )}
                <form onSubmit={submitHandler}>
                    <TextField
                        id="word-input"
                        className="word-input"
                        placeholder="add word"
                    />
                </form>

                <Typography className="divider" variant="caption">
                    {solver.results.length > 0 ? 'results' : 'no results'}
                </Typography>

                <TableContainer className="results" component={Paper}>
                    <Table sx={{}} aria-label="simple table">
                        <TableBody>
                            {solver.results.map((word, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {word}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}

export default App;
