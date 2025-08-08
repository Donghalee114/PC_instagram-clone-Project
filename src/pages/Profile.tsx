import { useUser } from "../contexts/UserContext";
import DefalutPfp from "../assets/Default_pfp.jpg"
import "../utills/Profile.css"

export default function ProfileSetup() {
  const { user } = useUser();

  if (!user) {
    return <p>로그인 정보를 불러오는 중입니다...</p>;
  }

  console.log("Profile에서 user 확인:", user);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className="Profile-Top-Container">  
        <img style={{borderRadius : "100%" , width : "150px"}} src ={user.profileimage || DefalutPfp} />
        <div>
        <span style={{display : "flex" , justifyContent : "center" , alignItems : "center"}}>
          <h2>{user.username}</h2><span className="ProfileButton">프로필 편집</span><span className="ProfileButton">보관된 스토리 보기</span>
          </span>
         <span style={{display : "flex" , justifyContent : "center" , alignItems : "center"}}>
          <p>게시물 : {user.posts}</p> <p>팔로워 : {user.followers}</p> <p>팔로우 : {user.followers}</p>
          </span>
        </div>

        </div>
    
    </div>
  );
}
