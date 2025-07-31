import { useEffect, useState } from 'react';
import '../utills/SignUpPage.css'
import { useNavigate } from 'react-router-dom';
import { FaFacebookSquare } from "react-icons/fa";
import Input from '../component/input';

type LoginProps = {
  setIsLoggedIn : React.Dispatch<React.SetStateAction<boolean>>;
};


export default function SignUp({ setIsLoggedIn }: LoginProps ){


const Navigate = useNavigate();
const [getUserEmail , setGetUserEmail] = useState("");
const [getUserPassword , setGetUserPassword] = useState("");
const [getUserName , setGetUserName] = useState("");
const [getUserId , setGetUserId] = useState("");
const [isSignUpButtonOn, setIsSignUpButtonOn] = useState(false);

const handleSignUp = () => {
  if (getUserEmail && getUserPassword && getUserName && getUserId)
  {
    // 여기에 회원가입 로직을 추가하세요.
    alert("회원가입이 완료되었습니다. (아직 회원가입 기능은 구현되지 않았습니다.)");
    setIsLoggedIn(true);
    Navigate("/");
  }
  else {
    alert("모든 필드를 입력해주세요.");
  }
}

useEffect(() => {
  if (getUserEmail && getUserPassword.length > 6 && getUserName && getUserId) {
    setIsSignUpButtonOn(true);
  }else {
    setIsSignUpButtonOn(false);
  }
}, [getUserEmail, getUserPassword, getUserName, getUserId]);

  return(
    <div className="signup-container">
    <div className='make-account'>
      <h2>Instagram</h2>
      <p>친구들의 사진과 동영상을 보려면 가입하세요.</p>
      <button onClick={() => alert("아직 미구현된 기능입니다.")} className="signup-button signup-button-on" style={{display : "flex" , justifyContent : "center" , alignItems : "center"}}><FaFacebookSquare style={{width : "34px" , height : "20px"}} /> Facebook으로 가입</button>

    <div className='signup-inputs'>
      <span style={{display : "flex" , justifyContent : "space-between" , alignItems : "center"}}>
        <hr style={{width : "45%"}}/><p style={{width : "15%"}}>또는</p><hr style={{width : "45%"}} />
        </span>
        <Input type = "text" placeholder='전화번호 또는 이메일' onChange={(e) => setGetUserEmail(e.target.value)} />
        <Input type = "password" placeholder='비밀번호' onChange={(e) => setGetUserPassword(e.target.value)} />
        <Input type = "text" placeholder='성명' onChange={(e) =>setGetUserName(e.target.value)} />
        <Input type = "text" placeholder='사용자 이름' onChange={(e) => setGetUserId(e.target.value)} />
        <p>저희 서비스를 이용하는 사람이 회원님의 연락처 정보를 Instagram에 업로드했을 수도 있습니다. 더 알아보기</p>
      <button className={isSignUpButtonOn ? 'signup-button signup-button-on' : 'signup-button'} style={{width : "100%"}} onClick={handleSignUp}>가입</button>
      </div>
    </div>
      
      <div className='goto-login'>
        <p>계정이 있으신가요? <br/><strong onClick={() => Navigate("/login")} className="Link" style={{color : "rgba(112, 141, 255)"}}>로그인</strong></p>
      </div>
    </div>
  )
}