import React, { useEffect } from 'react';
import { supabase } from './lib/supabaseClient';

export default function TestFetch() {
  useEffect(() => {
   // testFetch 함수 (async/await 없이)
function testFetch() {
  console.log('testFetch: 테스트 시작');
  supabase
    .from('users')
    .select('*')
    .eq('id', 'a75d813b-f94b-4785-b3c6-aeba7422de29')
    .limit(1)
    .then(({ data, error }) => {
      console.log('testFetch: 쿼리 실행 완료');
      console.log('쿼리 결과:', { data, error });
    })
    
}    testFetch();
  }, []);

  return <div>Supabase 테스트 - 콘솔 확인</div>;
}
