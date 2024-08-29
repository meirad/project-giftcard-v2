import React, { useState } from 'react';
import { setExpiringGiftCards } from './ApiCalls'; 
import { TextField, Button } from '@mui/material';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';

interface ExpirationFormProps {
    onClose: () => void; 
}

const ExpirationForm: React.FC<ExpirationFormProps> = ({ onClose }) => {
    const [expirationDate, setExpirationDate] = useState<string>('');

    const userId = '66cf25ac0a13f13b3773babe'; 

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

            if (expirationDate) {
                const response = await setExpiringGiftCards(userId, expirationDate);
                console.log(response);
                onClose();
            } else {
                console.error('Expiration date is null or undefined');
            }
        
    };

    return (
        <Box component="form" onSubmit={handleSubmit} padding={2}>
            <Typography variant="body1">
                Enter the number of days before expiration to send a reminder:
            </Typography>
            <TextField
                type="number"
                id="expirationDate"
                label="Days before expiration to reminder"
                value={expirationDate}
                sx={{width: '100%', marginBottom: 2}}
                onChange={(e) => setExpirationDate(e.target.value.toString())}
                required
            />
            <Box display="flex" justifyContent="space-evenly">
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    sx={{width: '50%'}}
                >
                    Set Expiration
                </Button>
                <Button 
                    type="button" 
                    variant="contained" 
                    color="secondary" 
                    sx={{width: '50%'}}
                    onClick={onClose} 
                >
                    Cancel
                </Button>
            </Box> 
        </Box>
    );
};

export default ExpirationForm;
