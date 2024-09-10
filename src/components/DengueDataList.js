import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import BarChart from "./BarChart"; // Import the BarChart component

const DengueDataList = () => {
  const [dengueData, setDengueData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    location: "",
    cases: "",
    deaths: "",
    date: "",
    regions: "",
  });

  // State for filter criteria
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const dengueCollection = collection(db, "dengueData");
      const dengueSnapshot = await getDocs(dengueCollection);
      const dataList = dengueSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Sort the data alphabetically by location
      dataList.sort((a, b) => a.location.localeCompare(b.location));

      setDengueData(dataList);
      filterData(dataList, selectedMonth, selectedYear); // Initial filter
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  const filterData = (data, month, year) => {
    if (!month && !year) {
      setFilteredData(data);
      return;
    }
    const filtered = data.filter((item) => {
      const date = new Date(item.date);
      const itemMonth = date.getMonth() + 1; // Months are 0-based in JS
      const itemYear = date.getFullYear();
      return (
        (month ? itemMonth === parseInt(month) : true) &&
        (year ? itemYear === parseInt(year) : true)
      );
    });
    setFilteredData(filtered);
  };

  const handleDelete = async (id) => {
    const dengueDocRef = doc(db, "dengueData", id);
    try {
      await deleteDoc(dengueDocRef);
      const updatedData = dengueData.filter((data) => data.id !== id);
      setDengueData(updatedData);
      filterData(updatedData, selectedMonth, selectedYear); // Re-filter after deletion
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      location: data.location,
      cases: data.cases,
      deaths: data.deaths,
      date: data.date,
      regions: data.regions,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const dengueDocRef = doc(db, "dengueData", editingId);
    try {
      await updateDoc(dengueDocRef, {
        location: editForm.location,
        cases: Number(editForm.cases),
        deaths: Number(editForm.deaths),
        date: editForm.date,
        regions: editForm.regions,
      });
      const updatedData = dengueData.map((data) =>
        data.id === editingId ? { id: editingId, ...editForm } : data
      );
      updatedData.sort((a, b) => a.location.localeCompare(b.location));
      setDengueData(updatedData);
      filterData(updatedData, selectedMonth, selectedYear); // Re-filter after update
      setEditingId(null);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div>
      <h2 style={{ marginLeft: "20px" }}>Dengue Data List</h2>
      
      {/* Filter Section */}
      <div style={{ margin: "20px 0" }}>
        <input
          type="number"
          min="1"
          max="12"
          placeholder="Month (1-12)"
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            filterData(dengueData, e.target.value, selectedYear);
          }}
        />
        <input
          type="number"
          min="2000"
          max={new Date().getFullYear()}
          placeholder="Year"
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            filterData(dengueData, selectedMonth, e.target.value);
          }}
        />
      </div>

      {editingId ? (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="Location"
            value={editForm.location}
            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Cases"
            value={editForm.cases}
            onChange={(e) => setEditForm({ ...editForm, cases: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Deaths"
            value={editForm.deaths}
            onChange={(e) => setEditForm({ ...editForm, deaths: e.target.value })}
            required
          />
          <input
            type="date"
            placeholder="Date"
            value={editForm.date}
            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Regions"
            value={editForm.regions}
            onChange={(e) => setEditForm({ ...editForm, regions: e.target.value })}
            required
          />
          <button type="submit">Update Data</button>
          <button onClick={() => setEditingId(null)}>Cancel</button>
        </form>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Location</th>
              <th>Region</th>
              <th>Cases</th>
              <th>Deaths</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <tr key={data.id}>
                  <td>{data.location}</td>
                  <td>{data.regions}</td>
                  <td>{data.cases}</td>
                  <td>{data.deaths}</td>
                  <td>{data.date}</td>
                  <td>
                    <button onClick={() => handleEdit(data)}>Edit</button>
                    <button onClick={() => handleDelete(data.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DengueDataList;
