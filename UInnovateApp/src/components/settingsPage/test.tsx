import React, { useState } from 'react';

// Define a functional component named Counter
const Counter: React.FC = () => {
  // Declare a state variable 'count' with an initial value of 0
  const [count, setCount] = useState(0);


  const handleButtonClick = () => {
    setCount(count+1)
  }
  // JSX (UI) rendering
  return (
    <div>
      {/* Display the current count */}
      <p>Count: {count}</p>

      {/* Button to increment the count */}
      <button onClick={handleButtonClick}>Increment</button>
    </div>
  );
};

// Export the Counter component as the default export of this module
export default Counter;
