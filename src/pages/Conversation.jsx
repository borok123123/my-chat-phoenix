/**
 * Node modules
 */
import { motion } from 'framer-motion';
import { useLoaderData, useLocation, useNavigation } from 'react-router-dom';

/**
 * Custom hooks
 */
import { usePromptPreloader } from '../hooks/userPromptPreloader';

/**
 * Components
 */
import PageTitle from '../components/PageTitle';
import UserPrompt from '../components/UserPrompt';
import AiResponse from '../components/AiResponse';
import PromptPreloader from '../components/PromptPreloader';

const Conversation = () => {
  const data = useLoaderData();
  const title = data?.conversation?.title ?? "Untitled Conversation";
  const chats = data?.conversation?.chats ?? [];

  const { promptPreloaderValue } = usePromptPreloader();
  const location = useLocation();

  // ✅ New: Get navigation state
  const navigation = useNavigation();
  const isLoading = navigation.state === 'submitting';

  return (
    <>
      {/* Meta title */}
      <PageTitle title={`${title} | Phoenix`} />

      <motion.div
        className='max-w-[700px] mx-auto !will-change-auto'
        initial={!location.state?._isRedirect && { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.05, ease: 'easeOut' }}
      >
        {chats.map((chat) => (
          <div key={chat.$id}>
            <UserPrompt text={chat.user_prompt} />
            <AiResponse aiResponse={chat.ai_response} />
          </div>
        ))}
      </motion.div>

      {promptPreloaderValue && isLoading && (
        <PromptPreloader promptValue={promptPreloaderValue} />
      )}
    </>
  );
};

export default Conversation;
