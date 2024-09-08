import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from 'axios';

function App() {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [filterValue, setFilterValue] = useState(''); // Store the search input value
    const token = localStorage.getItem('token'); // Get token from local storage

    const columns = [
        {
            name: 'Company Name',
            selector: row => row.companyName,
            sortable: true
        },
        {
            name: 'Link',
            cell: row => <a href={row.link} target="_blank" rel="noopener noreferrer">Visit</a>,
            sortable: true
        },
        {
            name: 'Mark it',
            cell: row => (
                <input
                    type="checkbox"
                    checked={row.checked || false} // Initialize with server data
                    onChange={() => handleCheckToggle(row.id, !row.checked)}
                />
            ),
            sortable: false
        },
        {
            name: 'Note',
            cell: row => (
                <input
                    type="text"
                    value={row.note || ''} // Initialize with server data
                    onChange={(e) => handleNoteChange(row.id, e.target.value)}
                />
            ),
            sortable: false
        }
    ];

    useEffect(() => {
        // Fetch data from the Express server with token in headers
        axios.get('http://localhost:3000/data', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setRecords(response.data);
            setFilteredRecords(response.data); // Initialize filtered records
        })
        .catch(error => console.error('Error fetching data:', error));
    }, [token]);

    function handleFilter(event) {
        const value = event.target.value.toLowerCase();
        setFilterValue(value); // Update the filter value state
        const newFilteredData = records.filter(row => 
            row.companyName.toLowerCase().includes(value)
        );
        setFilteredRecords(newFilteredData);
    }

    function handleCheckToggle(id, checked) {
        axios.post('http://localhost:3000/data/check', { id, checked }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            const updatedRecords = records.map(record => 
                record.id === id ? { ...record, checked } : record
            );
            setRecords(updatedRecords);
            setFilteredRecords(updatedRecords.filter(record => 
                record.companyName.toLowerCase().includes(filterValue)
            ));
        })
        .catch(error => console.error('Error updating check status:', error));
    }

    function handleNoteChange(id, note) {
        axios.post('http://localhost:3000/data/note', { id, note }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            const updatedRecords = records.map(record => 
                record.id === id ? { ...record, note } : record
            );
            setRecords(updatedRecords);
            setFilteredRecords(updatedRecords.filter(record => 
                record.companyName.toLowerCase().includes(filterValue)
            ));
        })
        .catch(error => console.error('Error updating note:', error));
    }

    return (
        <div className='container mt-5' style={{
            backgroundColor: "white",
            margin: 20,
            padding:10,
            minHeight: 100
        }}>
            <div className="text-end">
                <input 
                    type="text"
                    placeholder="Search by company name..."
                    onChange={handleFilter}
                    value={filterValue} // Bind the search input to state
                />
            </div>
            <DataTable
                columns={columns}
                data={filteredRecords}
                fixedHeader
                pagination
            />
        </div>
    );
}

export default App;
