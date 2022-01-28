import React from 'react'
import { Card, Typography, CardHeader, CardContent, Grid } from '@mui/material'


const index = (props) => {   
    return (
        <Card sx={{ mb: 3 }}>
            <CardHeader 
                title={`ID: ${props['index']}`}
            />
            <CardContent sx={{overflowX: 'hidden'}}>
                <Grid container>
                    <Grid item>
                        <Typography variant="h3">{props.params.name}</Typography>
                    </Grid>
                    <Grid item>
                    <Typography variant="h5">Bal: 1 CHOICE</Typography>
                    <Typography component="p" sx={{overflowX: 'hidden', wordBreak: 'break-all'}}>AssetUrl: <a href={props.params.url} target='_blank' rel="noreferrer">{props.params.url}</a></Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default index
