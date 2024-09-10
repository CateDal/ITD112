import React from 'react';
import AddDengueData from './components/AddDengueData';
import DengueDataList from './components/DengueDataList';
import CsvUploader from './components/CsvUploader'; // Import CsvUploader component

function App() {
  return (
    <div className="App">
      <h1>Dengue Data CRUD App</h1>
      <AddDengueData />
      <CsvUploader /> {/* Include CsvUploader component */}
      <DengueDataList />
    </div>
  );
}

export default App;
