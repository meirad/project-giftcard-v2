import React from 'react';
import { Card, Typography} from '@mui/material';
import { GetGiftCards } from '../Services/ApiCalls';
import { Box,  } from '@mui/system';


type GiftCardType = {
  id: number;
  name: string;
  expirationDate: string;
  userId: number;
  expiring: string;
};

const Cards: React.FC = () => {
  const [giftCards, setGiftCards] = React.useState<GiftCardType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchGiftCards = async () => {
    try {
      const [allGiftCards ] = await Promise.all([
        GetGiftCards()
      ]);
      setGiftCards([...allGiftCards ]); 
      setLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchGiftCards();
  }, []);

 
const getBackgroundImage = (name: string) => {
  switch (name) {
    case 'Amazon Gift Card':
      return 'http://localhost:3000/amazon_dkblue_noto_email_v2016_us-main._CB468775337_.png';
    case 'Starbucks Gift Card':
      return 'http://localhost:3000/starbaucks.jpg';
    case 'Target Gift Card':
      return 'http://localhost:3000/target-gift-card.webp';
    case 'eBay Gift Card':
      return 'http://localhost:3000/ebay.jpg';
    default:
  }
};


  return (
    <div style={{ display: 'flex', flexDirection:'column', justifyContent: 'flex-start',alignItems: 'center', height: '90vh' , width: '100vw' }}>      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <Typography variant="h4" component="h2" sx={{fontSize:"30px", marginBottom: '20px', width:'360px', display:'flex', justifyContent:'flex-start', marginTop: '10px'}}>
      Gift Cards
      </Typography>
      {giftCards.sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()).map((giftCard: GiftCardType) => (
        <Card sx={{ width: '360px', marginBottom: '20px', display: 'flex', padding: '10px' }}>
      <img
        src={getBackgroundImage(giftCard.name) || undefined}
        alt={giftCard.name}
        style={{ width: '150px', height: '100px', marginLeft: '10px', marginRight:'20px', borderRadius: '6px' }}
      />
      <Box textAlign={'left'} display={'flex'} flexDirection={'column'} justifyContent={'center'}  >
        <Typography variant="h5" component="h4" sx={{fontSize:"20px"}}>
          {giftCard.name}
        </Typography>
        <Typography sx={{ mb: 1.5, fontSize:'14px'}} color="gray">
          Valid until: {new Date(giftCard.expirationDate).toLocaleDateString()}
        </Typography>
      </Box>
  </Card>
  
))}

    </div>
  );
};

export default Cards;
