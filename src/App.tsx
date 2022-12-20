import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import Solver from './solver';

function App() {
    const solver = useRef(new Solver('./dictionary.txt'));

    useEffect(() => {
        console.log(solver.current.loadDictionary());
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
