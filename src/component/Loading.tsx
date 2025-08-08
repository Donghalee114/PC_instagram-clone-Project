import { useEffect, useState } from "react";


import {  useUser } from "../contexts/UserContext";

export default function Loading() {

  const [showMessage, setShowMessage] = useState(false);
  const [count, setCount] = useState(10);
  const{ handleLogout }= useUser()

  useEffect(() => {
    setShowMessage(false);
    setCount(10);

    // 2초 후 메시지 표시
    const showMessageTimeout = setTimeout(() => {
      setShowMessage(true);
    }, 2000);

    // 1초마다 카운트 감소
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          location.reload(); // 새로고침 실행
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 클린업
    return () => {
      clearTimeout(showMessageTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(27, 27, 29, 1)",
      zIndex: 10,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <img
        src="https://i.gifer.com/ZZ5H.gif"
        alt="Loading..."
        style={{ width: "80px" }}
      />
      <p style={{
        color: "#6366f1",
        fontWeight: 700,
        fontSize: "1.2rem",
        marginTop: "12px"
      }}>
        로딩중입니다 잠시만 기다려 주세요..
      </p>
      {showMessage && (
        <p style={{ color: "white", marginTop: "10px", textAlign: "center" }}>
          로그인 정보를 불러오고 있어요...<br />
          {count}초 후 자동으로 새로고침 됩니다.<br />
          문제가 지속되면 다시 로그인 해주세요.
          <div style={{marginTop :"20px" , width : "250px" , height : "40px" , border : "1px solid red" , cursor : "pointer" , display : "flex" , alignItems : "center" , justifyContent : "center"}} onClick={handleLogout}>로그아웃 하기</div>
        </p>
      )}
    </div>
  );
}
