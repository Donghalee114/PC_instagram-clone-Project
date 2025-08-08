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
  const [loginFail, setLoginFail] = useState(false);
  const [emailNotFound, setEmailNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setIsLoggedIn, setUser } = useUser();
  
  const [loginCount, setLoginCount] = useState<number>(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);

  useEffect(() => {
    setIsLoginButtonOn(userId.length > 0 && password.length > 6);
  }, [userId, password]);

  useEffect(() => {
    if (!isBlocked) return;

    if (blockTimeLeft <= 0) {
      setIsBlocked(false);
      setLoginFail(false)
      setLoginCount(0);
      return;
    }

    const timerId = setInterval(() => {
      setBlockTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
 
  }, [isBlocked, blockTimeLeft]);

  const handleKeyDown = (e: { key: string }) => {
    if(isBlocked) return
    if(isLoading){
      console.log("block");
      return
    }

    if (e.key === "Enter") handleLogin();
  };

  const handleLogin = async () => {
    // 차단 상태면 로그인 차단 메시지
    if (isBlocked) {
      alert(`비밀번호를 5회 이상 틀리셨습니다. ${blockTimeLeft}초 후에 다시 시도해주세요.`);
      return;
    }

    if (!userId || password.length <= 6) return;

    setIsLoading(true);
    setLoginFail(false);
    setEmailNotFound(false);

    // 1. 이메일 존재 여부 확인
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", userId)
      .single();

    if (checkError || !existingUser) {
      setIsLoading(false);
      setEmailNotFound(true);
      return;
    }

    // 2. 이메일 존재하면 로그인 시도
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userId,
      password,
    });

    await new Promise(res => setTimeout(res, 1500)); // 1.5초 딜레이
    setIsLoading(false);

    if (error) {
      setLoginFail(true);
      setLoginCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 5) {
          setIsBlocked(true);
          setBlockTimeLeft(30);
        }
        return newCount;
      });
      return;
    }

    const user = data.user;

    // 이메일 인증 확인
    if (!user.email_confirmed_at) {
      alert("이메일 인증이 완료되지 않았습니다. 이메일을 인증해주세요.");
      return;
    }

    // 유저 프로필 조회
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      alert("유저 프로필 로드 실패");
      return;
    }

    // 로그인 시간 업데이트
    const { error: setLastLoginError } = await supabase
      .from("users")
      .update({ lastlogin: new Date().toISOString() })
      .eq("id", userProfile.id);

    if (setLastLoginError) {
      console.error("lastLogin 업데이트 실패:", setLastLoginError);
    }

    setUser(userProfile);
    setIsLoggedIn(true);
    setLoginFail(false);
    setEmailNotFound(false);
    setLoginCount(0);
    setIsBlocked(false);
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
          onKeyDown={handleKeyDown}
          value={userId}
        />
        <input
          type="password"
          placeholder="비밀번호"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          value={password}
        />

        <button
          disabled={!isLoginButtonOn || isBlocked}
          className={isLoginButtonOn && !isBlocked ? "login-button login-button-on" : "login-button"}
          onClick={handleLogin}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>

        {/* 이메일 없을 때 메시지 */}
        {emailNotFound && <p style={{ color: "red" }}>존재하지 않는 이메일입니다. <br />이메일을 다시한번 확인해주세요</p>}

        {/* 비밀번호 틀렸을 때 메시지 */}
        {loginFail && !isBlocked && !emailNotFound && (
          <p style={{ color: "red" }}>
            잘못된 비밀번호입니다. 다시 확인해주세요. <br /> 비밀번호를 5회 이상 틀리실 경우 <br />30초 동안 로그인이 제한됩니다. {loginCount}/5
          </p>
        )}

        {/* 로그인 차단 메시지 */}
        {isBlocked && (
          <p style={{ color: "red" }}>
            비밀번호를 5회 이상 틀리셨습니다. {blockTimeLeft}초 후에 다시 시도해주세요.
          </p>
        )}

        <span style={{ display: "flex", alignItems: "center", width: "100%" }}>
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
