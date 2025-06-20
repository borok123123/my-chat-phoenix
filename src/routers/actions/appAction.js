
/**
 * Node modules
 */
import { redirect } from 'react-router-dom';

/**
 * Custom modules
 */
import { account, databases } from '../../lib/appwrite';
import { getConversationTitle, getAiResponse } from '../../api/googleAi';
import generateID from '../../utils/generateID';

/**
 * Handles the user prompt action, creating a conversation and storing both the user's prompt and the AI-generated response.
 *
 * @async
 * @function userPromptAction
 * @param {FormData} formData - The form data containing the user's prompt.
 *
 * @returns {Promise<void>} Redirects the user to the newly created conversation page.
 */
const userPromptAction = async (formData) => {
  const userPrompt = formData.get('user_prompt');

  // Get current user info
  const user = await account.get();

  // Get a conversation title based on user prompt
  const conversationTitle = await getConversationTitle(userPrompt);
  let conversation = null;

  try {
    // Create a new conversation document in the Appwrite database
    conversation = await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      '6852e404002c574ce28b',   // collection id
      generateID(),
      {
        title: conversationTitle,
        user_id: user.$id,
      },
    );
  } catch (err) {
    console.log(`Error creating conversation: ${err.message}`);
  }

  // Generate an AI response based on the user's prompt
  const aiResponse = await getAiResponse(userPrompt);
  console.log("AI Response:", aiResponse); 

  try {
    // Create a new chat document in the 'chats' collection
    await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      '6853a29800187738f8c8',
      generateID(),
      {
        user_prompt: userPrompt,
        ai_response: aiResponse,
        conversation: conversation.$id,
      },
       [
    `read("user:${user.$id}")`,
    `update("user:${user.$id}")`,
    `delete("user:${user.$id}")`,
    `write("user:${user.$id}")`
  ]
    );
  } catch (err) {
    console.log(`Error creating chat: ${err.message}`);
  }

  return redirect(`/${conversation.$id}`);
};

/**
 * Deletes a conversation document from the database and returns the conversation title.
 *
 * @async
 * @function conversationAction
 * @param {FormData} formData - The form data containing the conversation details.
 * @returns {Promise<Object>} Returns an object containing the conversation title after deletion.
 * @throws Will throw an error if the deletion process fails.
 */
const conversationAction = async (formData) => {
  const conversationId = formData.get('conversation_id');
  const conversationTitle = formData.get('conversation_title');

  try {
    await databases.deleteDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      '6852e404002c574ce28b',
      conversationId,
    );

    return { conversationTitle };
  } catch (err) {
    console.log(`Error in deleting conversation: ${err.message}`);
  }
};

/**
 * Handles incoming requests based on the `request_type` form data.
 *
 * @async
 * @function appAction
 * @param {Object} request - The incoming request object containing the form data.
 * @returns {Promise<*>} - Returns the result of the action based on the `request_type` (e.g., `userPromptAction` or `conversationAction`).
 **/
const appAction = async ({ request }) => {
  const formData = await request.formData();
  const requestType = formData.get('request_type');

  if (requestType === 'user_prompt') {
    return await userPromptAction(formData);
  }

  if (requestType === 'delete_conversation') {
    return await conversationAction(formData);
  }
};

export default appAction;
