import { firestore } from 'firebase';
export class RegisterConversation {
    chat?: string;
    user?: string;
    messages_sent?: number;
    nickname?: string;
    uid_user?: string;
    last_conversation_at?: firestore.Timestamp;
    viewed?: boolean;
    profile_photo?: string;
}
