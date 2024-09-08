import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import { Typography } from '@mui/material';
import { useState } from 'react';

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <>
            <div style={{
                padding: 80,
                marginBottom: 10,
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Typography variant={"h4"}>Welcome to JobRem, signup below</Typography>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Card variant="outlined" style={{ width: 400, padding: 20 }}>

                    <TextField 
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth={true} 
                        label="E-mail" 
                        variant="outlined" 
                    />
                    <br /><br />

                    <TextField 
                        onChange={(e) => setPassword(e.target.value)}
                        type="password" 
                        fullWidth={true} 
                        label="Password" 
                        variant="outlined" 
                    />
                    <br /><br />

                    <Button size={'large'} variant="contained" onClick={() => {
                        fetch("http://localhost:3000/admin/signup", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                username: email,
                                password: password
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.token) {
                                localStorage.setItem("token", data.token);
                                window.location="/signin"
                                console.log("Token stored successfully");
                            } else {
                                console.error("Token not received:", data);
                            }
                        })
                        .catch(error => console.error('Error:', error));
                    }}>Sign up</Button>
                </Card>
            </div>
        </>
    );
}

export default Signup;
