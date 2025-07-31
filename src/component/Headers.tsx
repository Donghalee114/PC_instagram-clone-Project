import {FaHome , FaSearch , FaPlusSquare , FaHeart , FaUser , FaRegCompass ,FaRegPaperPlane , FaInstagram   } from 'react-icons/fa'
import { FaRegSquarePlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';


import '../utills/Header.css'

export default function Headers(){
const Navigate = useNavigate();


return(
  <div className="header">

<span style={{display : "flex" , alignItems : "center"}}>
  <h2 className="instagram-title">
    Instagram
  </h2>
<FaInstagram className="instagram-icon" />
</span>

    <div className = "iconDiv">
      <span onClick={() => Navigate('/')}>
        <FaHome className="icon" />
        <span className="label">홈</span>
      </span>
      <span>
        <FaSearch className = "icon" />
        <span className="label"> 검색</span>
        </span>
      <span>
        <FaRegCompass className = "icon" />
        <span className="label">탐색 탭</span>
      </span>
      <span>
        <FaPlusSquare className = "icon" />
        <span className="label">릴스</span>
      </span>
      <span>
        <FaRegPaperPlane className = "icon" />
        <span className="label">메세지</span>
      </span>
      <span>
        <FaHeart className = "icon" />
        <span className="label">알림</span>
      </span>
      <span>
        <FaRegSquarePlus className = "icon" />
        <span className="label">만들기</span>
      </span>
      <span>
        <FaUser className = "icon" />
        <span className="label">프로필</span>
      </span>
    </div>
  </div>
)
}