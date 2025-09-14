import { Routes, Route } from 'react-router-dom'
import { Container, Typography } from '@mui/material'
import './App.css'

function App() {
    return (
        <Container maxWidth="lg">
            <Routes>
                <Route path="/" element={<Typography variant="h4">Welcome to Lyrics Assistant</Typography>} />
            </Routes>
        </Container>
    )
}

export default App