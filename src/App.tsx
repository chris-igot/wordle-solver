import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import Solver, { COLS, Marks } from './solver';
import Word from './components/word';

function App() {
    const solver = useRef(new Solver('./dictionary.txt'));

    useEffect(() => {
        solver.current.loadDictionary();
    }, []);

    return (
        <div className="App">
            <div>
                <form>
                    <Word
                        word="     "
                        row={0}
                        letterStates={Array(COLS).fill(Marks.UNMARKED)}
                        updateWord={() => {}}
                        toggleLetterState={() => {}}
                    />
                    <Word
                        word="fluke"
                        row={1}
                        letterStates={Array(COLS).fill(Marks.UNMARKED)}
                        updateWord={() => {}}
                        toggleLetterState={() => {}}
                    />
                </form>
            </div>
        </div>
    );
}

export default App;
