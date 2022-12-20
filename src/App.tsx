import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import Solver from './solver';
import Word from './components/word';

function App() {
    const solver = useRef(new Solver('./dictionary.txt'));

    useEffect(() => {
        solver.current.loadDictionary();
    }, []);

    return (
        <div className="App">
            <div>
                <form action="" method="get">
                    <Word row={0} />
                    <Word word="fluke" row={1} />
                </form>
            </div>
        </div>
    );
}

export default App;
