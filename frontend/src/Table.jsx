import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from 'axios';

function App() {
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
                    // checked={row.checked}
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
                    // value={row.note}
                    onChange={(e) => handleNoteChange(row.id, e.target.value)}
                />
            ),
            sortable: false
        }
    ]

    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);

    useEffect(() => {
        // Fetch data from the Express server
        axios.get('http://localhost:3000/data')
            .then(response => {
                setRecords(response.data);
                setFilteredRecords(response.data); // Initialize filtered records
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    function handleFilter(event) {
        const filterValue = event.target.value.toLowerCase();
        const newFilteredData = records.filter(row => 
            row.companyName.toLowerCase().includes(filterValue)
        );
        setFilteredRecords(newFilteredData);
    }

    function handleCheckToggle(id, checked) {
        axios.post('http://localhost:3000/data/check', { id, checked })
            .then(response => {
                // Update local state with the new checked value
                const updatedRecords = records.map(record => 
                    record.id === id ? { ...record, checked } : record
                );
                setRecords(updatedRecords);
                setFilteredRecords(updatedRecords.filter(record => 
                    record.companyName.toLowerCase().includes(document.querySelector('input[type="text"]').value.toLowerCase())
                ));
            })
            .catch(error => console.error('Error updating check status:', error));
    }

    function handleNoteChange(id, note) {
        axios.post('http://localhost:3000/data/note', { id, note })
            .then(response => {
                // Update local state with the new note value
                const updatedRecords = records.map(record => 
                    record.id === id ? { ...record, note } : record
                );
                setRecords(updatedRecords);
                setFilteredRecords(updatedRecords.filter(record => 
                    record.companyName.toLowerCase().includes(document.querySelector('input[type="text"]').value.toLowerCase())
                ));
            })
            .catch(error => console.error('Error updating note:', error));
    }

    return (
        <div className='container mt-5' style={{
            backgroundColor: "white",
            margin: 20,
            
            padding:10,
            // width: 300,
            minHeight: 100
        }}>
            <div className="text-end">
                <input 
                    type="text"
                    placeholder="search by company name....."
                    onChange={handleFilter}
                />
            </div>
            <DataTable
                columns={columns}
                data={filteredRecords}
                // selectableRows
                fixedHeader
                pagination
            />
        </div>
    );
    
}

export default App;
