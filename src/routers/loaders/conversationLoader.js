import { redirect } from 'react-router-dom';
import { account, databases } from '../../lib/appwrite';
import { Query } from 'appwrite';

const conversationLoader = async ({ params }) => {
  const { conversationId } = params;
  const data = {};
  try {
    // ✅ Get user
    data.user = await account.get();
    console.log("Logged in user:", data.user);
  } catch (err) {
    console.log(`Error getting user account: ${err.message}`);
    return redirect('/login');
  }

  try {
    // ✅ Get the conversation itself
    data.conversation = await databases.getDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_CONVERSATIONS_COLLECTION_ID,
      conversationId
    );

    // ✅ Get the associated chats
    const chatsResponse = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      '6853a29800187738f8c8', // <-- The chats collection ID
      [
        Query.equal('conversation', conversationId),
        Query.orderAsc('$createdAt'),
      ]
    );
    data.conversation.chats = chatsResponse.documents;

  } catch (err) {
    console.log(`Error getting conversation or chats: ${err.message}`);
    throw err;
  }

  return data;
};

export default conversationLoader;
