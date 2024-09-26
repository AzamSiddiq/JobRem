import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function AppBar() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    function callBack2(data) {
      if (data.username) {
        setUserEmail(data.username);
      }
    }
    
    function callBack1(res) {
      res.json().then(callBack2);
    }
    
    fetch("http://localhost:3000/admin/me", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    }).then(callBack1);
  }, []);

  return (
    <div style={styles.appBar}>
      <div>
        <Typography variant='h6' style={styles.title}>JobRem</Typography>
      </div>
      <div style={styles.userInfoContainer}>
        {userEmail ? (
          <>
            <div style={styles.userEmail}>{userEmail}</div>
            <div style={styles.buttonContainer}>
              <Button
                variant='contained'
                onClick={() => {
                  localStorage.setItem("token", null);
                  window.location = "/";
                }}
                style={styles.logoutButton}
              >
                Logout
              </Button>
            </div>
          </>
        ) : (
          <>
            <div style={styles.buttonContainer}>
              <Button
                variant='contained'
                onClick={() => {
                  navigate("/signup");
                }}
                style={styles.signupButton}
              >
                Sign up
              </Button>
            </div>
            <div style={styles.buttonContainer}>
              <Button
                variant='contained'
                onClick={() => {
                  navigate("/Signin");
                }}
                style={styles.signinButton}
              >
                Sign in
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  appBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1976D2",
    padding: "10px 20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#ffffff",
    margin: 0,
  },
  userInfoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  userEmail: {
    color: "#ffffff",
    marginRight: "20px",
  },
  buttonContainer: {
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: "#ffffff",
    color: "#1976D2",
    '&:hover': {
      backgroundColor: "#e0e0e0",
    },
  },
  signupButton: {
    backgroundColor: "#4caf50",
    '&:hover': {
      backgroundColor: "#66bb6a",
    },
  },
  signinButton: {
    backgroundColor: "#2196f3",
    '&:hover': {
      backgroundColor: "#64b5f6",
    },
  },
};

export default AppBar;
