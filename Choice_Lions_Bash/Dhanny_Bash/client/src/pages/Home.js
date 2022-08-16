import React from 'react'
import { Avatar, Box, Button, Paper, Typography, Container, IconButton, List} from '@mui/material';
import { Notifications } from '@mui/icons-material';

import ChoiceImage from '../Images/choice.png'
import { useAccountContext } from '../context/account';
import Dashboard from './Dashboard';


const Home = () => {
    const { selectedAccount } = useAccountContext();
    return (
        selectedAccount.address === undefined ? (
            <Container maxWidth="lg">
                <Paper>
                    <List>
                        <Box sx={{p: 5, textAlign: "center" }}>
                            <Avatar src={ChoiceImage} sx={{ margin: 'auto', width: '150px', height: '150px' }} />
                            <Typography variant="h3">Choice Coin</Typography>
                            <Typography component="p">2.53k members</Typography>
                            <Button>Join</Button>
                            <IconButton><Notifications/></IconButton>
                        </Box>
                    </List>
                </Paper>
            </Container>
        )
        :
        <>
            <Dashboard />
        </>
    )
}

export default Home
