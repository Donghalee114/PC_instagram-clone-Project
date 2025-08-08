import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaFacebookSquare } from "react-icons/fa";
import testImg from "../assets/landing-3x.png";
import { useUser } from "../contexts/UserContext"; // context import
import { supabase } from "../lib/supabaseClient";
import '../utills/LoginPage.css'

export default function Login() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginButtonOn, setIsLoginButtonOn] = useState(false);
  const [loginFali , setLoginFail] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const { setIsLoggedIn, setUser } = useUser();

  useEffect(() => {
    setIsLoginButtonOn(userId.length > 0 && password.length > 6);
  }, [userId, password]);

const handleLogin = async () => {
if (!userId || password.length <= 6) return;
setIsLoading(true)
  const { data, error } = await supabase.auth.signInWithPassword({
    email: userId,
    password,
  });

await new Promise(res => setTimeout(res, 500)); // 1.5초 딜레이 추가
  setIsLoading(false)
  if (error) {
    
    setLoginFail(true)

    return;
  }

  const user = data.user;

  // 이메일 인증 여부 체크
  if (!user.email_confirmed_at) {
    alert("이메일 인증이 완료되지 않았습니다. 이메일을 인증해주세요.");
    return;
  }

  // 유저 메타데이터 or 추가 데이터는 users 테이블에서 따로 조회
  const { data: userProfile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

const { error: setLastLoginError } = await supabase
  .from("users")
  .update({ lastlogin: new Date().toISOString() })  // 컬럼명 확인 필수
  .eq("id", userProfile.id);

if (setLastLoginError) {
  console.error("lastLogin 업데이트 실패:", setLastLoginError);
}
  if (profileError) {
    alert("유저 프로필 로드 실패");
    console.error(profileError);
    return;
  }

  setUser(userProfile);  // UserContext에 저장
  setIsLoggedIn(true);
  navigate("/");
};


  return (
    <div className="login-container">
      <div style={{ width: "500px", height: "500px", marginTop: "10%" }}>
        <img style={{ width: "100%" }} src={testImg} alt="landing" />
      </div>

      <div className="login-page">
        <h1>Instagram</h1>

        <input
          type="text"
          placeholder="전화번호, 사용자 이름 또는 이메일"
          onChange={(e) => setUserId(e.target.value)}
     
          value={userId}
        />
        <input
          type="password"
          placeholder="비밀번호"
          onChange={(e) => setPassword(e.target.value)}
        
          value={password}
        />

        <button
          disabled={!isLoginButtonOn}
          className={isLoginButtonOn ? "login-button login-button-on" : "login-button"}
          onClick={handleLogin}
        >
         {isLoading ? "로그인 중..." :"로그인"}
        </button>
    {loginFali && <p style={isLoading ? {color : "rgba(214, 6, 6, 1)"} : {color : "red"}}>잘못된 비밀번호입니다. 다시확인해주세요</p>}
        <span style={{ display: "flex", alignItems: "center" , width : "100%" }}>
          <hr style={{ width: "45%" }} />
          <p style={{ width: "15%" }}>또는</p>
          <hr style={{ width: "45%" }} />
        </span>

        <button
          onClick={() => alert("아직 미구현된 기능입니다.")}
          className="signup-button signup-button-on"
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <FaFacebookSquare style={{ width: "34px", height: "20px" }} /> Facebook으로 로그인
        </button>

        <p className="Link">비밀번호를 잊으셨나요?</p>

        <div>
          <p>
            계정이 없으신가요?{" "}
            <strong
              onClick={() => navigate("/signup")}
              className="Link"
              style={{ color: "rgba(112, 141, 255)" }}
            >
              가입하기
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
