import { useParams } from 'react-router-dom';
import SecureChatApp from '@/components/SecureChatApp';

const ChatSession = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  
  return <SecureChatApp sessionId={sessionId} />;
};

export default ChatSession;