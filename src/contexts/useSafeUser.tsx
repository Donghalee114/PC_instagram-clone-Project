import { useUser } from './UserContext';

export const useSafeUser = () => {
  const context = useUser();
  if (!context.user) {
    throw new Error('로그인이 필요합니다.');
  }
  return context.user;
};