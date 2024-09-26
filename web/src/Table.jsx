import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from 'axios';

function App() {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [filterValue, setFilterValue] = useState(''); 
    const token = localStorage.getItem('token'); 

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
                    checked={row.checked || false}
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
                    value={row.note || ''}
                    onChange={(e) => handleNoteChange(row.id, e.target.value)}
                    style={styles.noteInput}
                />
            ),
            sortable: false
        }
    ];

    useEffect(() => {
        axios.get('http://localhost:3000/data', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setRecords(response.data);
            setFilteredRecords(response.data);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, [token]);

    function handleFilter(event) {
        const value = event.target.value.toLowerCase();
        setFilterValue(value);
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
        <div style={styles.appContainer}>
            <div className='container' style={styles.container}>
                <div className="text-end" style={styles.searchContainer}>
                    <input 
                        type="text"
                        placeholder="Search by company name..."
                        onChange={handleFilter}
                        value={filterValue}
                        style={styles.searchInput}
                    />
                </div>
                <DataTable
                    columns={columns}
                    data={filteredRecords}
                    fixedHeader
                    pagination
                    customStyles={tableStyles}
                    style={{ width: '100%', marginBottom: '20px' }} 
                />
            </div>
            <footer style={styles.footer}>
                <p style={styles.footerText}>made by 2004</p>
            </footer>
        </div>
    );
}

const styles = {
    appContainer: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between' 
    },
    container: {
        backgroundColor: "#ffffff", 
        padding: "20px 40px",
        margin: "20px auto",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "900px",
        flex: 1, 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: '100%', 
    },
    searchContainer: {
        marginBottom: "20px"
    },
    searchInput: {
        width: "100%", 
        maxWidth: "300px", 
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "16px"
    },
    noteInput: {
        width: '100%',
        padding: '5px',
        border: '1px solid #ddd',
        borderRadius: '4px'
    },
    footer: {
        padding: '10px 0',
        textAlign: 'center',
        backgroundColor: 'rgb(144, 236, 253)',
        color: '#ffffff', 
        borderRadius: '12px 12px 0 0', 
    },
    footerText: {
        margin: 0,
    }
};

const tableStyles = {
    header: {
        style: {
            backgroundColor: 'rgb(144, 236, 253)', 
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            padding: '12px 20px'
        },
    },
    headRow: {
        style: {
            backgroundColor: '#1976D2',
            borderBottomWidth: '1px',
            borderBottomColor: 'rgb(144, 236, 253)', 
            borderBottomStyle: 'solid',
        },
    },
    headCells: {
        style: {
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '16px'
        },
    },
    rows: {
        style: {
            backgroundColor: '#ffffff',
            fontSize: '14px',
            minHeight: '50px', 
            borderBottom: '1px solid rgb(144, 236, 253)', 
        }
    },
    pagination: {
        style: {
            borderTop: '1px solid #ddd',
            paddingTop: '10px',
            backgroundColor: '#f8f9fa'
        }
    }
};


const globalStyles = {
    body: {
        backgroundColor: 'rgb(144, 236, 253)', 
        margin: 0,
        color: '#ffffff' 
    }
};

document.body.style.backgroundColor = globalStyles.body.backgroundColor;
document.body.style.margin = globalStyles.body.margin;
document.body.style.color = globalStyles.body.color;

export default App;
