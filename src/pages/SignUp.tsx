import { useEffect, useState } from 'react';
import '../utills/SignUpPage.css';
import { useNavigate } from 'react-router-dom';
import { FaFacebookSquare } from 'react-icons/fa';
import Input from '../component/input';
import EmailVerificationModal from '../component/EmailVerificationModal';


export default function SignUp() {
  const Navigate = useNavigate();
  const [getUserEmail, setGetUserEmail] = useState('');
  const [getUserPassword, setGetUserPassword] = useState('');
  const [getUserName, setGetUserName] = useState('');
  const [getUserId, setGetUserId] = useState('');
  const [isSignUpButtonOn, setIsSignUpButtonOn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000"

  // 추가: 아이디 유효성 / 중복 상태
  const [isValidUsername, setIsValidUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

  // 정규식 검사 (영문소문자, 숫자, _, . / 3~30자)
  const isUsernameFormatValid = (username: string) => {
    const regex = /^[a-z0-9._A-Z]{3,30}$/;
    return regex.test(username);
  };

  // 중복 검사 함수
  const checkUsernameDuplicate = async (username: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/check-username?username=${username}`);
      const data = await res.json();
      return !data.exists; // true면 사용 가능
    } catch (error) {
      console.error("중복 체크 에러:", error);
      return false;
    }
  };

  // 사용자 이름 입력 시 유효성/중복 검사
  useEffect(() => {
    const validateUsername = async () => {
      const isFormatOk = isUsernameFormatValid(getUserId);
      setIsValidUsername(isFormatOk);

      if (isFormatOk) {
        const isAvailable = await checkUsernameDuplicate(getUserId);
        setIsUsernameAvailable(isAvailable);
      } else {
        setIsUsernameAvailable(false);
      }
    };

    if (getUserId) validateUsername();
  }, [getUserId]);

  // 가입 버튼 활성화 조건
  useEffect(() => {
    if (
      getUserEmail &&
      getUserPassword.length >= 6 &&
      getUserName &&
      getUserId &&
      isValidUsername &&
      isUsernameAvailable
    ) {
      setIsSignUpButtonOn(true);
    } else {
      setIsSignUpButtonOn(false);
    }
  }, [getUserEmail, getUserPassword, getUserName, getUserId, isValidUsername, isUsernameAvailable]);

  const handleSignUp = async () => {
    if (!isValidUsername) {
      alert('아이디는 영어 대문자, 소문자, 숫자, 밑줄(_), 마침표(.)만 허용하며 3~30자여야 합니다.');
      return;
    }

    if (!isUsernameAvailable) {
      alert('이미 사용 중인 아이디입니다.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: getUserEmail,
          password: getUserPassword,
          username: getUserId,
          name: getUserName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowModal(true);
      } else {
        alert(`회원가입 실패: ${data.message}`);
      }
    } catch (error) {
      alert('서버와 통신 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    Navigate('/login');
  };

  return (
    <div className="signup-container">
      <div className="make-account">
        <h2>Instagram</h2>
        <p>친구들의 사진과 동영상을 보려면 가입하세요.</p>
        <button
          onClick={() => alert('아직 미구현된 기능입니다.')}
          className="signup-button signup-button-on"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <FaFacebookSquare style={{ width: '34px', height: '20px' }} /> Facebook으로 가입
        </button>

        <div className="signup-inputs">
          <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <hr style={{ width: '45%' }} />
            <p style={{ width: '15%' }}>또는</p>
            <hr style={{ width: '45%' }} />
          </span>

          <Input type="text" placeholder="이메일" onChange={(e) => setGetUserEmail(e.target.value)} />
          <Input type="password" placeholder="비밀번호" onChange={(e) => setGetUserPassword(e.target.value)} />
          <Input type="text" placeholder="성명" onChange={(e) => setGetUserName(e.target.value)} />
          <Input type="text" placeholder="사용자 이름" onChange={(e) => setGetUserId(e.target.value)} />

          {/* 아이디 유효성 피드백 */}
          {getUserId && (
            <p style={{ color: isValidUsername && isUsernameAvailable ? 'green' : 'red', fontSize: '0.9em' }}>
              {isValidUsername
                ? isUsernameAvailable
                  ? '사용 가능한 아이디입니다.'
                  : '이미 사용 중인 아이디입니다.'
                : '아이디는 영어 대문자, 소문자, 숫자, _, . 만 사용 가능하며 3~30자여야 합니다.'}
            </p>
          )}

          <p>저희 서비스를 이용하는 사람이 회원님의 연락처 정보를 Instagram에 업로드했을 수도 있습니다. 더 알아보기</p>

          <button
            className={isSignUpButtonOn ? 'signup-button signup-button-on' : 'signup-button'}
            style={{ width: '100%' }}
            onClick={handleSignUp}
            disabled={!isUsernameAvailable}
          >
            가입
          </button>
        </div>
      </div>

      <div className="goto-login">
        <p>
          계정이 있으신가요? <br />
          <strong onClick={() => Navigate('/login')} className="Link" style={{ color: 'rgba(112, 141, 255)' }}>
            로그인
          </strong>
        </p>
      </div>

      {showModal && (
        <EmailVerificationModal email={getUserEmail} onClose={handleModalClose} />
      )}
    </div>
  );
}
