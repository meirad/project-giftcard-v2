import { getDb } from './mongo';
import moment from 'moment';
import { ObjectId } from 'mongodb';

interface GiftCard {
  _id: ObjectId;
  name: string;
  expirationDate: string;
  userId: string;
  expiringStatus?: string;
  notificationTime?: string; 
}

interface User {
  _id: ObjectId;
  notificationTime: number; 
}

async function getNotificationTime(userId: string, defaultDaysBeforeExpire: number): Promise<GiftCard[]> {
  const db = getDb();

  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) }) as User | null;

  if (!user) {
    throw new Error('User not found');
  }

  const giftCards = await db.collection('giftcards').find({ userId }).toArray() as GiftCard[];

  giftCards.forEach((giftCard) => {
    const daysUntilExpiration = moment(giftCard.expirationDate, 'DD-MM-YYYY').diff(moment(), 'days');

    if (daysUntilExpiration < 0) {
      giftCard.expiringStatus = "Expired";
    } else if (daysUntilExpiration <= user.notificationTime ) {
      giftCard.expiringStatus = "Expiring Soon";
    } else {
      giftCard.expiringStatus = "Active";
    }

    giftCard.notificationTime = moment(giftCard.expirationDate, 'DD-MM-YYYY')
      .subtract(user.notificationTime || defaultDaysBeforeExpire, 'days')      
      .format('DD-MM-YYYY');
  });

  console.log(defaultDaysBeforeExpire)

  console.log(user.notificationTime);
  
  const expiringGiftCards = giftCards.filter((giftCard) => giftCard.expiringStatus === "Expiring Soon");

  return expiringGiftCards;
}

export default getNotificationTime;
