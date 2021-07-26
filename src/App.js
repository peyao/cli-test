import React, { useEffect, useRef, useState } from "react";
import Cli from "./lib/cli";
import useOnce from "./hooks/useOnce";

import './App.css';

function App() {

  const consoleOutputRef = useRef(null);
  const appendToConsoleRef = useRef();
  const cliRef = useRef();
  const prevCommandsRef = useRef([]); // last 5 used commands

  const [consoleOutput, setConsoleOutput] = useState(["Type --help to get started"]);
  appendToConsoleRef.current = (toAppend) => setConsoleOutput(prevState => [...prevState, toAppend]);

  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (e) => setInputValue(e.target.value);
  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      appendToConsoleRef.current(`$ ${inputValue}`);
      cliRef.current.run(inputValue, (output) => appendToConsoleRef.current(output));
      setInputValue("");
    }
  }

  useOnce(() => {
    cliRef.current = new Cli(appendToConsoleRef, setConsoleOutput);
  });

  useEffect(() => {
    // scroll down after consoleOutput updates
    consoleOutputRef.current.scrollTop = consoleOutputRef.current.scrollHeight;
  }, [consoleOutput]);

  return (
    <div className="App">
      <div className="container mx-auto">
        <h1 className="pt-6 pb-6 text-3xl">Commander-based CLI</h1>

        <div className="p-1 bg-black rounded-md font-mono">
          {/* Output */}
          <div className="p-1 h-96 whitespace-pre-wrap overflow-y-scroll" ref={consoleOutputRef}>
            {consoleOutput.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>

          {/* Input */}
          <div className="flex border-t-2 border-white bg-gray-700 rounded">
            <span className="p-1">$</span>
            <input
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleInputKeyPress}
              className="w-full bg-black text-white p-1 pl-2 bg-gray-700 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
