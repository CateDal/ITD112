// src/components/FileUpload.js
import React, { useState } from 'react';
import Papa from 'papaparse';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          console.log('Parsed CSV data:', results.data);
          await saveDataToFirestore(results.data);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
        }
      });
    } else {
      alert('Please select a file first.');
    }
  };

  const saveDataToFirestore = async (data) => {
    try {
      const collectionRef = collection(db, 'yourCollectionName'); // Replace with your collection name
      for (const item of data) {
        await addDoc(collectionRef, item);
      }
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload and Save Data</button>
    </div>
  );
};

export default FileUpload;
