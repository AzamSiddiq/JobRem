import Card from '@mui/material/Card';
import { Typography, CardContent } from '@mui/material';
import { useEffect, useState } from 'react';

function Home() {
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShowDetails(true);
        }, 500);
    }, []);

    return (
        <>
            <div style={{
                padding: '40px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                minHeight: '100vh',
                position: 'relative',
                boxSizing: 'border-box',
                margin: 0
            }}>
                <Typography 
                    variant={"h4"} 
                    style={{
                        textAlign: 'center',
                        marginBottom: 45,
                        fontWeight: 'bold',
                        color: 'White',
                        padding: '10px 20px',
                        border: '3px solid #1976D2',
                        borderRadius: '8px',
                        animation: 'fadeInScale 2s ease-in-out',
                    }}
                >
                    Welcome to the JobRem
                </Typography>

                {showDetails && (
                    <Card 
                        elevation={3} 
                        style={{
                            position: 'absolute',
                            right: '10%',
                            top: '20%',
                            padding: 20,
                            backgroundColor: '#f0f8ff',
                            borderRadius: '15px',
                            width: '45%',
                            animation: 'fadeIn 2s ease-in-out'
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="body1"
                                style={{
                                    fontSize: '18px',
                                    fontFamily: 'Arial, sans-serif',
                                    color: '#004987',
                                    textAlign: 'left'
                                }}
                            >
                                This JobRem website helps you to find and easily apply for tech companies.
                                You can also mark and note any of the companies you are interested in.
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </div>

            <style>
                {`
                    @keyframes fadeInScale {
                        0% {
                            opacity: 0;
                            transform: scale(0.8);
                        }
                        100% {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }

                    @keyframes fadeIn {
                        0% { opacity: 0; }
                        100% { opacity: 1; }
                    }

                    html, body {
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        overflow-x: hidden;
                        overflow-y: hidden;
                    }
                `}
            </style>
        </>
    );
}

export default Home;
