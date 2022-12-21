import React, { useEffect } from 'react';
import useSolver, { COLS, Marks } from './hooks/useSolver';
import Word from './components/word';
import { TextField } from '@mui/material';

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
            <div>
                <div id="words-used">
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
                    <TextField id="word-input" />
                </form>

                <div>
                    {solver.results.map((word, index) => (
                        <div key={index}>{word}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
