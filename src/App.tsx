import React, { useEffect } from 'react';
import './App.css';
import useSolver, { COLS, Marks } from './hooks/useSolver';
import Word from './components/word';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';

function App() {
    const solver = useSolver();

    useEffect(() => {
        solver.findWords();
        console.log('foundWords triggered', solver.wordsUsed);
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
            solver.addWord(element.value.trim());
            element.value = '';
        }
    };

    return (
        <div className="App">
            <Paper className="content" elevation={3}>
                <Typography variant="h4" className="title">
                    Wordle Solver
                </Typography>

                <div id="words-used" className="words-used">
                    {solver.wordsUsed.map((word, row) => {
                        return (
                            <Word
                                key={row}
                                row={row}
                                word={word}
                                updateWord={solver.updateWord}
                                letterStates={solver.marks[row]}
                                toggleLetterState={toggle}
                            />
                        );
                    })}
                </div>
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
