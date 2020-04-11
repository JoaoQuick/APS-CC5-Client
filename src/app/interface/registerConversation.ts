import { firestore } from 'firebase';
export class RegisterConversation {
    chat: string;
    user: string;
    last_conversation_at?: firestore.Timestamp;
    viewed: boolean;
}
