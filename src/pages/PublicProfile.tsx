import { useEffect, useState } from "react";
import { useParams , useNavigate } from "react-router-dom";

import DefalutPfp from "../assets/Default_pfp.jpg";
import "../utills/Profile.css";
import type { User } from "../types/User";
import { useUser } from "../contexts/UserContext";
import Headers from "../component/Headers";
import { PiGearLight } from "react-icons/pi";
import { FaChevronDown } from "react-icons/fa";
import Loading from "../component/Loading"


import { supabase } from "../lib/supabaseClient";


export default function PublicProfile() {
  const navigate = useNavigate()
  const { username } = useParams();
  const { user: loggedInUser } = useUser();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followLoading, setFollowLoading] = useState<boolean>(false);



  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("로그아웃 실패:", error.message);
    } else {
    navigate('/login')
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
   
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (error || !data) {
        console.error("유저 조회 실패:", error);
        setLoading(false)
        navigate('/errorPage');
        return;
      }
        
      setProfileUser(data);
      
      const [followerResult, followingResult] = await Promise.all([
  supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", data.id),

  supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", data.id),
]);

const followerCount = followerResult.count ?? 0;
const followingCount = followingResult.count ?? 0;

// DB에도 저장
await supabase
  .from("users")
  .update({ followers: followerCount, following: followingCount })
  .eq("id", data.id);

// UI 갱신
setProfileUser({
  ...data,
  followers: followerCount,
  following: followingCount,
});
    
  if (loggedInUser && data) {
  const { data: followData, error: followError } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', loggedInUser.id)
    .eq('following_id', data.id)
    .single();

  if (followError && followError.code !== "PGRST116") {
    console.error("팔로우 조회 실패:", followError);
  } else {
    setIsFollowing(!!followData);
  }
}

      setLoading(false);
    };

    if (username) fetchProfile();

    
  }, [username , loggedInUser , navigate]);

if (loading) return <Loading />;
if (!profileUser) return null;

const isMyProfile = loggedInUser?.username === username;

const handleFollowToggle = async () => {
  if (!loggedInUser || !profileUser || followLoading) return;

  setFollowLoading(true);

  try {
    if (isFollowing) {
      // 언팔로우
      const { error: deleteError } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", loggedInUser.id)
        .eq("following_id", profileUser.id);

      if (deleteError) {
        console.error("언팔로우 실패:", deleteError);
      } else {
        setIsFollowing(false);
      }

    } else {
      // 중복 팔로우 방지 확인
      const { data: existing, error: checkError } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", loggedInUser.id)
        .eq("following_id", profileUser.id)
        .maybeSingle();

      if (checkError) {
        console.error("팔로우 확인 실패:", checkError);
        setFollowLoading(false);
        return;
      }

      if (!existing) {
        const { error: insertError } = await supabase
          .from("follows")
          .insert([
            {
              follower_id: loggedInUser.id,
              following_id: profileUser.id,
            },
          ]);

        if (insertError) {
          console.error("팔로우 실패:", insertError);
          setFollowLoading(false);
          return;
        }

        setIsFollowing(true);
      }
    }

    // 정확한 follower / following 수 가져오기
    const [followerResult, followingResult] = await Promise.all([
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", profileUser.id), // profileUser의 followers 수

      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", profileUser.id), // profileUser의 following 수
    ]);

    const followerCount = followerResult.count ?? 0;
    const followingCount = followingResult.count ?? 0;

    // users 테이블에 count 저장
    const { error: updateError } = await supabase
      .from("users")
      .update({
        followers: followerCount,
        following: followingCount,
      })
      .eq("id", profileUser.id);

    if (updateError) {
      console.error("users 테이블 count 저장 실패:", updateError);
    }

    // UI 반영
    setProfileUser(prev =>
      prev
        ? {
            ...prev,
            followers: followerCount,
            following: followingCount,
          }
        : null
    );

  } catch (e) {
    console.error("팔로우 토글 에러:", e);
  } finally {
    setFollowLoading(false);
  }
};





  return (
    <>
       <Headers/>
    
    
      <div className="Profile-Top-Container">
        <button onClick={() => console.log(profileUser)}></button>
        <div style={{display : "flex"}}>        
          {isMyProfile ? (
            <>
             <img
          style={{ borderRadius: "100%", width: "150px" ,height : "150px" , marginRight : "100px" }}
          src={profileUser.profileimage || DefalutPfp}
        />
     
        <div>
          <span className="userInfo">
            <h2>{profileUser.username}</h2>
          
              <>
                <span className="ProfileButton">프로필 편집</span>
                <span className="ProfileButton">보관된 스토리 보기</span>
             <PiGearLight onClick={handleLogout} style={{marginLeft : "10px", color : "White" , width : "30px" , height : "30px"}}/>
              </>
            
          </span>
          <span className="userInfo">
            <p>게시물: {profileUser.posts}</p>
            <p>팔로워: {profileUser.followers}</p>
            <p>팔로우: {profileUser.following}</p>
          </span>
          <span className="userInfo">
            <strong style={{color : "white"}}>{profileUser.name}</strong>
          </span>
              
        </div>
        
            </>
        
        ) : 
        (<>
         <img
          style={{ borderRadius: "100%", width: "150px" ,height : "150px" , marginRight : "100px" }}
          src={profileUser.profileimage || DefalutPfp}
        />
                <div>
          <span className="userInfo">
            <h2>{profileUser.username}</h2>
          
              <>
                <span
                onClick={handleFollowToggle}
                className="ProfileButton"
                style={{
                  
                  background: isFollowing ? "" : "#4a5df9",
                  cursor: followLoading ? "not-allowed" : "pointer",
                  opacity: followLoading ? 0.6 : 1,
                }}
              >
                {isFollowing ? <>팔로잉 <FaChevronDown style={{width : "10px" , height : "10px" , marginLeft : "5px"}}/></> : "팔로우"}
              </span>
                <span className="ProfileButton">메세지 보내기</span>
           
              </>
            
          </span>
          <span className="userInfo">
            <p>게시물: {profileUser.posts}</p>
            <p>팔로워: {profileUser.followers}</p>
            <p>팔로우: {profileUser.following}</p>
          </span>
          <span className="userInfo">
            <strong style={{color : "white"}}>{profileUser.name}</strong>
            {profileUser.bio && profileUser.bio || ""}
          </span>
          
        </div>
        </>)}</div>

{isMyProfile && <div className="highLight-Container" style={{ width  : "70%" , marginTop : "50px" , height : "80px" , display : "flex" , justifyContent : "start" , alignItems : "center"}}>
  {profileUser.storyHighlights?.length === null ? 
  <>
    <div style={{width : "100px" , height : "100px" , border : "5px solid black" , borderRadius : "100%"}}>
    dd
  </div>
  </>
 :  
 <>
  <div style={{width : "70px" , height : "70px" , border : "3px solid #363636" , borderRadius : "100%" , display : "flex" , justifyContent : "center" , alignItems : "center" }}>

<svg width="80" height="80" viewBox="0 0 100 100">
  <line x1="20" y1="50" x2="80" y2="50" stroke="#363636" strokeWidth="3" />
  <line x1="50" y1="20" x2="50" y2="80" stroke="#363636" strokeWidth="3" />
</svg>


  </div>
  
 </>
 }
 
 </div>}




    <div className="iconDiv" style={isMyProfile ? {marginTop : "30px" } : {marginTop : "100px"}}>
          <div>iCon1</div>  
          <div>iCon1</div>  
          <div>iCon1</div>
      </div>
  
      </div>

    
     </>
    
  );
}
