import { databases } from '../../lib/appwrite';
import { getAiResponse } from '../../api/googleAi';
import generateID from '../../utils/generateID';
import { Query } from 'appwrite';  // ✅ required to build the query

const conversationAction = async ({ request, params }) => {
  const { conversationId } = params;
  const formData = await request.formData();
  const userPrompt = formData.get('user_prompt');

  let chatHistory = [];
  let aiResponse = '';

  try {
    // ✅ Fetch previous chats for this conversation
    const chatsRes = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      '6853a29800187738f8c8', // your chat collection ID
      [Query.equal('conversation', conversationId), Query.orderAsc('$createdAt')]
    );

    chatHistory = chatsRes.documents.map(({ user_prompt, ai_response }) => ({
      user_prompt,
      ai_response,
    }));
  } catch (err) {
    console.log(`Error getting chat history: ${err.message}`);
  }

  try {
    aiResponse = await getAiResponse(userPrompt, chatHistory);
    console.log("AI Response:", aiResponse); // ✅ helpful log
  } catch (err) {
    console.log(`Error getting Gemini response: ${err.message}`);
  }

  try {
    await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      '6853a29800187738f8c8',
      generateID(),
      {
        user_prompt: userPrompt,
        ai_response: aiResponse,
        conversation: conversationId,
      },
    );
  } catch (err) {
    console.log(`Error storing chat: ${err.message}`);
  }

  return null;
};

export default conversationAction;
