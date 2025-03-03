import { Admin } from './Admin';
import { Chat } from './Chat';
import { useAuthContext } from './context/AuthContext';

export const Main: React.FC = () => {
  const [user] = useAuthContext();
  console.log(user.isAdmin);
  return <>{user.isAdmin ? <Admin /> : <Chat />}</>;
};
