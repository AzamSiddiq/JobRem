import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import { Typography } from '@mui/material';
import { useState } from 'react';

function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignin = () => {
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        fetch("http://localhost:3000/admin/login", {
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
                window.location= "/Table";
                console.log("Token stored successfully");
            } else {
                alert("Login failed. Please check your credentials.");
                console.error("Token not received:", data);
            }
        })
        .catch(error => {
            alert("An error occurred during login.");
            console.error('Error:', error);
        });
    };

    return (
        <>
            <div style={{
                padding: 80,
                marginBottom: 10,
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Typography variant={"h4"}>Welcome back, sign in below</Typography>
            </div>
       
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Card variant="outlined" style={{ width: 400, padding: 20 }}>
                    <TextField 
                        fullWidth 
                        id="email" 
                        label="E-mail" 
                        variant="outlined" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <br/><br/>
                    <TextField 
                        fullWidth 
                        id="password" 
                        label="Password" 
                        variant="outlined" 
                        type="password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <br/><br/>
                    <Button 
                        size={'large'} 
                        variant="contained" 
                        onClick={handleSignin}
                    >
                        Sign in
                    </Button>
                </Card>
            </div>
        </>
    );
}

export default Signin;
