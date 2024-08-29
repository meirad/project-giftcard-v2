import app  from '../../app';
import { getDb } from '../mongo';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';


//get all users
app.get('/users', async (req: Request, res: Response) => {
  try{
    const db = getDb();
    const data = await db.collection('users').find().limit(10).toArray();
    res.json(data);
  }
  catch(err){
    res.status(404).send('Users not found');
  }
});


//users by id
app.get('/users/:id', async (req: Request, res: Response) => {
  try{
    const db = getDb();
    const id = req.params.id;
    const data = await db.collection('users').findOne({ _id: new ObjectId(id) });
    res.json(data);
  }
  catch(err){
    res.status(404).send('User not found');
  }
});
