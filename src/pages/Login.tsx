import type React from "react";
import '../utills/InputComponent.css'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from '../component/input';
import testImg from '../assets/landing-3x.png'

type LoginProps = {
  setIsLoggedIn : React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Login({ setIsLoggedIn }: LoginProps) {
const [userId , setUserId] = useState('');
const [password , setPassword] = useState('');
const [isLoginButtonOn, setIsLoginButtonOn] = useState(false);

const Navigate = useNavigate();


useEffect(() => {
  if (userId.length > 0 &&  password.length > 6) {
    setIsLoginButtonOn(true);
  }} , [userId, password]);

  const handleLogin = () => {
    if (userId && password) {
      setIsLoggedIn(true);
      Navigate('/');
    } else {
      alert("아이디와 비밀번호를 입력해주세요.");
    }

  }

  return (
    <div className="login-container">
      <div style={{width : "500px" , height : "500px" , marginTop : "10%" }}><img style={{width : "100%"}} src ={testImg}/> </div>
      <div className="login-page">
      <h1>Instagram</h1>

      <Input type ="text" placeholder="전화번호, 사용자 이름 또는 이메일" onChange={e => setUserId(e.target.value)}/>
      <Input type="password" placeholder="비밀번호"  onChange={e => setPassword(e.target.value)}/>
      <button disabled ={!isLoginButtonOn} className ={isLoginButtonOn ? "login-button login-button-on" : "login-button "} onClick= {handleLogin}>로그인</button>
        <span style={{width : "100%" , display : "flex" , justifyContent : "space-between" , alignItems : "center"}}>
        <hr style={{width : "45%"}}/><p style={{width : "15%"}}>또는</p><hr style={{width : "45%"}} />
        </span>
      <p className = "Link">비밀번호를 잊으셨나요?</p>
      <div>
      <p>계정이 없으신가요? <strong onClick={() => Navigate("/signup")} className ="Link" style={{color : "rgba(112, 141, 255)"}}>가입하기</strong></p>
      </div>
    </div>


    </div>
    
  );
}