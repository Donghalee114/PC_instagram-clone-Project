import { useRef, useState } from 'react';
import Headers from "../component/Headers"
import '../utills/HomePage.css'

import PostMap from "../utills/postItem.json"
import DefaultPfp from "../assets/Default_pfp.jpg"
import { useUser } from "../contexts/UserContext"; //UserContext import

import {
  IoHeartSharp,
  IoChatbubbleOutline,
  IoPaperPlaneOutline,
  IoHeartOutline,
  IoBookmarkOutline
} from "react-icons/io5";
import Loding from '../component/Loading';

export default function Home() {
  const storyListRef = useRef<HTMLDivElement | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<{ [key: number]: boolean }>({});
  const [postItems, setPostItems] = useState(PostMap);
  

  const { user , isLoading } = useUser(); //Context에서 user 가져오기

  if (!user) return null; // 혹은 로딩 화면 반환

  const toggleShowMore = (id: number) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleLike = (postId: number) => {
    setPostItems(posts =>
      posts.map(post => {
        if (post.id === postId) {
          const newLiked = !post.likedByUser;
          return {
            ...post,
            likedByUser: newLiked,
            likeCount: newLiked ? post.likeCount + 1 : Math.max(post.likeCount - 1, 0),
          };
        }
        return post;
      })
    );
  };

  const scrollLeft = () => {
    storyListRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
    console.log(user)
  };

  const scrollRight = () => {
    storyListRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  function formatHeartCount(count: number): string {
    if (count >= 10000) {
      const 만 = (count / 10000).toFixed(count % 10000 === 0 ? 0 : 1);
      return `${만}만개`;
    } else if (count >= 1000) {
      return count.toLocaleString() + '개';
    } else {
      return `${count}개`;
    }
  }

  const storyItems = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `사용자${i + 1}`
  }));

  return (
    <>
    {isLoading && <Loding />}
      <div className="home-page">
      <Headers />

      <div className="Story-container">
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '700px' }}>
          <button className="scroll-button left" onClick={scrollLeft}>{'<'}</button>
          <div className="story-list" ref={storyListRef}>
            {storyItems.map((item) => (
              <span key={item.id}>
                <div className="story-item"></div>
                <p>{item.name}</p>
              </span>
            ))}
          </div>
          <button className="scroll-button right" onClick={scrollRight}>{'>'}</button>
        </span>

        <div className="post-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {postItems.map((post) => (
            <div key={post.id}>
              <div className='post-userInterface'>
                <img src={post.userAvatar || DefaultPfp}
                  style={{
                    marginLeft: "5px", width: "32px", height: "32px",
                    border: "1px solid black", borderRadius: "20px", marginRight: "5px"
                  }} />
                <strong>{post.userId}</strong>
              </div>

              <div className="post-item">
                <p>{post.content}</p>
              </div>

              <div className='post-icon-container'>
                <span className='post-icon-text'>
                  {!post.likedByUser ? (
                    <IoHeartOutline onClick={() => toggleLike(post.id)} className={`post-icon heart`} />
                  ) : (
                    <IoHeartSharp className='post-icon heart' onClick={() => toggleLike(post.id)} style={{ color: "red" }} />
                  )}
                  <p style={{ marginRight: "10px" }}>{formatHeartCount(post.likeCount)}</p>

                  <span className='post-icon-text'>
                    <IoChatbubbleOutline className='post-icon' />
                    <p>{post.commentCount}</p>
                  </span>
                  <span className='post-icon-text'>
                    <IoPaperPlaneOutline className='post-icon' />
                    <p>{post.shareCount}</p>
                  </span>
                </span>
                <span className='post-icon-right'>
                  <IoBookmarkOutline className='post-icon' />
                </span>
              </div>

              <div className={`post-info-container ${expandedPosts[post.id] ? 'expanded' : ''}`}>
                <strong style={{ marginLeft: "5px" }}>{post.userId}:</strong>
                <p className={`toLong ${expandedPosts[post.id] ? 'expanded' : ''}`}>
                  {post.postText ?? '게시글의 내용이 없습니다.'}
                </p>
                <p
                  onClick={() => toggleShowMore(post.id)}
                  className="moreShow"
                  style={{ cursor: 'pointer', display: post.postText && post.postText.length > 12 ? 'inline' : 'none' }}
                >
                  {expandedPosts[post.id] ? '' : '더보기'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="UserInfo-container" style={{marginLeft : "50px" , marginTop: "40px", width: "380px", height: "380px", padding: "10px" }}>
        <div className='LoggedUserInfo-container' style={{ display: "flex", alignItems: "center", width: "100%", height: "100px", border: '1px solid black' , }}>
          <img style={{ width: "50px", height: "50px" , borderRadius : "100%" }} src={user.profileimage || DefaultPfp} />
          <span style={{ marginLeft: "10px", display: "flex", flexDirection: "column" }}>
            <span style={{ color: "white" }}>{user.username}</span>
            <span style={{ fontSize: "14px", color: "#a19696ff" }}>{user.name}</span>
          </span>
        </div>
      </div>
    </div>
    </>
  
  );
}
