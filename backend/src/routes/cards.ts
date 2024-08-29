import app from '../../app';
import { getDb } from '../mongo';
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import  getNotificationTime   from '../notificationTime'


 //get all giftcards
app.get('/giftcards', async (req: Request, res: Response) => {
 try{
    const db = getDb();
    const data = await db.collection('giftcards').find().limit(10).toArray();
    res.json(data);
 }
  catch(err){
      res.status(404).send('Giftcards not found');
  }
});

//giftcards by id
app.get('/giftcards/:id', async (req: Request, res: Response) => {
    try{
        const db = getDb();
        const id = req.params.id;
        const data = await db.collection('giftcards').findOne({ _id: new ObjectId(id) });
        res.json(data);
    }
    catch(err){
        res.status(404).send('Giftcard not found');
    }
});


//giftcards by user id
app.get('/users/:id/giftcards', async (req: Request, res: Response) => {
    try{
      const db = getDb();
      const id = req.params.id;
      const data = await db.collection('giftcards').find({ userId: id }).toArray();
      res.json(data);
    }
    catch(err){
        res.status(404).send('User doesnt have any giftcards');
    }
}
);



// Gift cards expiring date in 2 days fromthe user notification time

app.get('/users/:id/expiring-time', async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const userId = req.params.id;

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user || user.notificationTime === undefined) {
      res.status(404).send('User not found or no notification time set');
      return;
    }

    const expiringGiftCards = await getNotificationTime(userId, user.notificationTime);

    console.log(expiringGiftCards);
    
    if (expiringGiftCards.length > 0) {
      res.json(expiringGiftCards);
    } else {
      res.status(404).send('No gift cards are expiring in the next two days');
    }
  } catch (err) {
    res.status(500).send('An error occurred while fetching expiring gift cards');
  }
});



app.put('/users/:id/notification-time', async (req: Request, res: Response) => {
    try {
    const db = getDb();
    const userId = req.params.id;
    const { notificationTime } = req.body;
  
    console.log(notificationTime); // Add this line
    await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: { notificationTime } });
    res.send('Notification time updated successfully');
    } catch (err) {
    res.status(500).send('An error occurred while updating notification time');
    }
  }
    );
