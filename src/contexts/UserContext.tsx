import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/User';
import { supabase } from '../lib/supabaseClient';
import Loding from '../component/Loading';

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  isLoading: boolean;
  isSupabaseReady : boolean;
  handleLogout : () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //Supabase 클라이언트 준비 상태를 관리하는 새로운 상태
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);

  //Supabase 클라이언트 준비가 완료될 때까지 기다리는 useEffect
  useEffect(() => {
   
    setIsLoading(true)
    // Supabase 클라이언트가 완전히 초기화될 시간을 줍니다.
    const timer = setTimeout(() => {
      if (supabase) {
     
        setIsSupabaseReady(true);
        setIsLoading(false)
      } else {
        console.error('[SupabaseCheck] Supabase 클라이언트가 초기화되지 않았습니다.');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // DB에서 유저 정보 가져오기 (수정됨)
  const fetchUserProfile = async (id: string | null | undefined) => {
  

    if (!id) {
      console.error('fetchUserProfile: 유저 ID가 유효하지 않습니다. 쿼리를 실행하지 않습니다.');
      setUser(null);
      localStorage.setItem('isLoggedIn', 'false');
      setIsLoggedIn(false);
      return false;
    }

    try {
      const queryBuilder = supabase
        .from('users')
        .select('*')
        .eq('id', id);



      // 변경점: .single() 대신 .limit(1) 사용
      const { data, error } = await queryBuilder.limit(1);

      // 변경점: data가 배열로 반환되므로 data[0]으로 접근
      if (error || !data || data.length === 0) {
        setUser(null);
        localStorage.setItem('isLoggedIn', 'false');
        setIsLoggedIn(false);
        console.error('fetchUserProfile: 유저 프로필 조회 실패:', error);
        return false;
      } else {
        setUser(data[0]); // 배열의 첫 번째 항목을 user 상태로 설정
        setIsLoggedIn(true);
        return true;
      }
    } catch (error) {
      console.error('fetchUserProfile: 유저 프로필 조회 중 오류:', error);
      setUser(null);
      localStorage.setItem('isLoggedIn', 'false');
      setIsLoggedIn(false);
      return false;
    }
  };

  // 세션 초기화 및 상태 세팅 (마운트 시 1회 실행)
  useEffect(() => {
    //Supabase 클라이언트가 준비되면 실행
    if (!isSupabaseReady) return;

    const fetchSessionAndProfile = async () => {
      console.log('[SessionCheck] 시작');
      setIsLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      console.log('[SessionCheck] getSession:', session, error);

      if (error || !session?.user) {
        console.log('[SessionCheck] 세션 없음 또는 에러');
        setUser(null);
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
        setIsLoading(false);
        return;
      }

      console.log('[SessionCheck] 세션 유저 있음:', session.user.id);
      const success = await fetchUserProfile(session.user.id);
      console.log('[SessionCheck] fetchUserProfile 결과:', success);
      localStorage.setItem('isLoggedIn', success ? 'true' : 'false');
      setIsLoading(false);
    };

    fetchSessionAndProfile();
  }, [isSupabaseReady]); //isSupabaseReady가 true가 되면 이 훅이 실행됩니다.

  // 인증 상태 변경 구독
  useEffect(() => {
    //Supabase 클라이언트가 준비되면 실행
    if (!isSupabaseReady) return;

    setIsLoading(true);
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthStateChange] event:', event, session?.user?.id);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        if (session?.user) {
          console.log('Calling fetchUserProfile with id:', session.user.id);
          const success = await fetchUserProfile(session.user.id);
          console.log('[AuthStateChange] fetchUserProfile 결과:', success);
          localStorage.setItem('isLoggedIn', success ? 'true' : 'false');
        }
      }

      if (event === 'SIGNED_OUT') {
        console.log('[AuthStateChange] SIGNED_OUT 처리');
        setUser(null);
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isSupabaseReady]); //isSupabaseReady가 true가 되면 이 훅이 실행됩니다.


  const handleLogout = () =>  {
    setIsLoggedIn(false)
    setIsLoading(false)
    setUser(null)
    localStorage.setItem('isLoggedIn', 'false');
  }

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, isLoading , isSupabaseReady ,handleLogout}}>
      {(isLoading || !isSupabaseReady) && <Loding />}
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser는 UserProvider 내부에서만 사용 가능합니다.');
  return context;
};