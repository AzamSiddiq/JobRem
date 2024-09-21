import Card from '@mui/material/Card';
import { Typography } from '@mui/material';
import ListGroup from 'react';

function Home() {
   

    return (
        <>
            <div style={{
                padding: 80,
                marginBottom: 10,
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Typography variant={"h4"}>Welcome to the JobRem</Typography>
            </div>
       
            {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Card variant="outlined" style={{ width: 400, padding: 20 }}>
                    <Card.Header variant={"h6"}>JobRem? what is it.</Card.Header>
                    <Card.Text>This tool will help you out to make data of technical company where you 
                        applied , and it will also provide you links and options of companies in the world.
                    </Card.Text>
                    <br/><br/>
                    <Card.Header>Feature</Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item>No. of companies</ListGroup.Item>
                        <ListGroup.Item>Direct apply link</ListGroup.Item>
                        <ListGroup.Item>Mark it</ListGroup.Item>
                        <ListGroup.Item>Add note for particular company</ListGroup.Item>
                    </ListGroup>
                   </Card>
            </div> */}
        </>
    );
}

export default Home;
