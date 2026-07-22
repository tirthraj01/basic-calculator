import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// ==========================================
// 1. INLINE CSS (Grayscale & Non-Colored)
// ==========================================
const styles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: sans-serif;
  }
  body {
    background-color: #f5f5f5;
    color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
  .app-container {
    padding: 20px;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .nav-container {
    text-align: center;
    margin-bottom: 30px;
  }
  .nav-container a {
    color: #333;
    text-decoration: none;
    font-weight: bold;
    border: 1px solid #333;
    padding: 8px 16px;
    border-radius: 4px;
    margin: 0 10px;
  }
  .calculator-wrapper {
    background-color: #fff;
    border: 2px solid #000;
    width: 300px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 4px 4px 0px #000;
  }
  .display-screen {
    background-color: #eaeaea;
    border: 1px solid #ccc;
    text-align: right;
    padding: 15px;
    font-size: 24px;
    margin-bottom: 20px;
    min-height: 60px;
    overflow-x: auto;
  }
  .keypad {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  .calc-btn {
    background-color: #fff;
    border: 1px solid #000;
    padding: 15px 0;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.1s;
  }
  .calc-btn:active {
    background-color: #ddd;
  }
  .calc-btn.zero {
    grid-column: span 2;
  }
`;

// ==========================================
// 2. BASIC COMPONENTS
// ==========================================

// Arrow function component for the Home route
const Home = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Welcome</h1>
      <p>Click "Calculator" above to start calculating.</p>
    </div>
  );
};

// Arrow function component for the screen display
const Display = ({ value }) => {
  return <div className="display-screen">{value}</div>;
};

// Arrow function component for individual buttons
const Button = ({ label, onClick, className = '' }) => {
  return (
    <button 
      className={`calc-btn ${className}`} 
      onClick={() => onClick(label)}
    >
      {label}
    </button>
  );
};

// ==========================================
// 3. MAIN CALCULATOR LOGIC COMPONENT
// ==========================================

const Calculator = () => {
  // useState hooks
  const [currentValue, setCurrentValue] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  
  // useRef hook to manage focus on the calculator container
  const containerRef = useRef(null);

  // useEffect hook to log mount status and auto-focus
  useEffect(() => {
    console.log("Calculator component mounted.");
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Arrow function to handle number input
  const handleNumber = (num) => {
    setCurrentValue((prev) => (prev === '0' ? num : prev + num));
  };

  // Arrow function to handle operators (+, -, *, /)
  const handleOperator = (op) => {
    setOperator(op);
    setPreviousValue(currentValue);
    setCurrentValue('0');
  };

  // Arrow function to perform the calculation
  const calculate = () => {
    if (!operator || !previousValue) return;

    const current = parseFloat(currentValue);
    const previous = parseFloat(previousValue);
    let result = 0;

    switch (operator) {
      case '+':
        result = previous + current;
        break;
      case '-':
        result = previous - current;
        break;
      case '*':
        result = previous * current;
        break;
      case '/':
        result = current === 0 ? 'Error' : previous / current;
        break;
      default:
        return;
    }

    setCurrentValue(String(result));
    setOperator(null);
    setPreviousValue(null);
  };

  // Arrow function to clear the calculator
  const handleClear = () => {
    setCurrentValue('0');
    setPreviousValue(null);
    setOperator(null);
  };

  return (
    <div className="calculator-wrapper" ref={containerRef} tabIndex="0">
      <Display value={currentValue} />
      
      <div className="keypad">
        <Button label="C" onClick={handleClear} />
        <Button label="/" onClick={handleOperator} />
        <Button label="*" onClick={handleOperator} />
        <Button label="-" onClick={handleOperator} />

        <Button label="7" onClick={handleNumber} />
        <Button label="8" onClick={handleNumber} />
        <Button label="9" onClick={handleNumber} />
        <Button label="+" onClick={handleOperator} />

        <Button label="4" onClick={handleNumber} />
        <Button label="5" onClick={handleNumber} />
        <Button label="6" onClick={handleNumber} />
        <Button label="=" onClick={calculate} />

        <Button label="1" onClick={handleNumber} />
        <Button label="2" onClick={handleNumber} />
        <Button label="3" onClick={handleNumber} />
        
        <Button label="0" onClick={handleNumber} className="zero" />
        <Button label="." onClick={handleNumber} />
      </div>
    </div>
  );
};

// ==========================================
// 4. ROOT APP COMPONENT WITH ROUTING
// ==========================================

const App = () => {
  return (
    <Router>
      {/* Injecting the grayscale CSS styles globally */}
      <style>{styles}</style>
      
      <div className="app-container">
        <nav className="nav-container">
          <Link to="/">Home</Link>
          <Link to="/calculator">Calculator</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;