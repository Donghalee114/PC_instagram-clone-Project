import { useRef, useState } from 'react';
import Headers from "../component/Headers"
import '../utills/HomePage.css'
import PostMap from "../utills/postItem.json"
import DefaultPfp from "../assets/Default_pfp.jpg"

import { IoHeartSharp ,IoChatbubbleOutline , IoPaperPlaneOutline , IoHeartOutline , IoBookmarkOutline } from "react-icons/io5";


export default function Home() {
 const storyListRef = useRef<HTMLDivElement | null>(null);
 const [expandedPosts , setExpandedPosts] = useState<{ [key : number] : boolean}>({})

 const [postItems, setPostItems] = useState(PostMap);

 const toggleShowMore = (id: number) => {
  setExpandedPosts((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
};



  const storyItems = [
    { id: 1, name: '사용자1' },
    { id: 2, name: '사용자2' },
    { id: 3, name: '사용자3' },
    { id: 4, name: '사용자4' },
    { id: 5, name: '사용자5' },
    { id: 6, name: '사용자6' },
    { id: 7, name: '사용자7' },
    { id: 8, name: '사용자8' },
    { id: 9, name: '사용자9' },
    { id: 10, name: '사용자10' },
  ];


// 좋아요 토글 함수 수정 예시
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
  };

  const scrollRight = () => {
    storyListRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  function formatHeartCount(count: number): string {
  if (count >= 10000) {
    const 만 = (count / 10000).toFixed(count % 10000 === 0 ? 0 : 1);
    return `${만}만개`;
  } else if (count >= 1000) {
    return count.toLocaleString() + '개'; // 예: 1,320개
  } else {
    return `${count}개`;
  }
}


  return (
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
            <>
            <div className='post-userInterface'>
             <img src={post.userAvatar || DefaultPfp} style={{width : "32px" , height : "32px" , border : "1px solid black" , borderRadius : "20px" , marginRight : "5px"}} /> <strong>{post.userId}</strong>
            </div>
             <div key={post.id} className="post-item">
              <p>{post.content}</p>
            </div>

            <div className='post-icon-container' >
            <span className='post-icon-text'>
              <span className='post-icon-text'>
              {!post.likedByUser ? <IoHeartOutline onClick={() => toggleLike(post.id)}  
              className={`post-icon heart`} /> : <IoHeartSharp className='post-icon heart' onClick={() => toggleLike(post.id)}  style={{color : "red"}}/>}<p style={{marginRight : "10px"}}>{formatHeartCount(post.likeCount)}</p>
              <span className='post-icon-text'><IoChatbubbleOutline  className='post-icon' /><p>{post.commentCount}</p></span>
              <span className='post-icon-text'><IoPaperPlaneOutline className='post-icon'/><p>{post.shareCount}</p></span>
            </span>
              <span className='post-icon-right'>
                  <IoBookmarkOutline className='post-icon' />
              </span>
              </span>
            </div>
        <div className={`post-info-container ${expandedPosts[post.id] ? 'expanded' : ''}`}>
          <strong style={{display: "inline-block" , marginLeft : "5px" , height : "20px" , width : "auto" }}>{post.userId}: </strong>
          <p className={`toLong ${expandedPosts[post.id] ? 'expanded' : ''}`}>
            {post.postText ?? '게시글의 내용이 없습니다.'}
            
          </p>
          <p 
            onClick={() => toggleShowMore(post.id)} 
            className={`moreShow`}
            style={{ cursor: 'pointer', display: post.postText && post.postText.length > 12 ? 'inline' : 'none' }}
          >
            {expandedPosts[post.id] ? '' : '더보기'}
          </p>
        </div>

            </>

          ))}
      
      </div>


      </div>
      
    </div>
  );
}
