import { firestore } from 'firebase';
export class Messaging {
    user: string;
    msg: string;
    datetime?: firestore.Timestamp;
}
