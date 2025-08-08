import {
  FaHome, FaSearch, FaPlusSquare, FaHeart, FaUser,
  FaRegCompass, FaRegPaperPlane, FaInstagram
} from 'react-icons/fa';
import { FaRegSquarePlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useSafeUser } from '../contexts/useSafeUser';
import DefaultPfP from '../assets/Default_pfp.jpg'
import '../utills/Header.css';
import { useState } from 'react';
import Search from './Search';

export default function Headers() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const user = useSafeUser();

  const toggleSearch = () => setCollapsed(prev => !prev);

  const menuItems = [
    { icon: <FaHome style={{ width: '27px', height: '27px' }} />, label: '홈', onClick: () => navigate('/') },
    { icon: <FaSearch style={{ width: '27px', height: '27px' }} />, label: '검색', onClick: toggleSearch },
    { icon: <FaRegCompass style={{ width: '27px', height: '27px' }} />, label: '탐색 탭' },
    { icon: <FaPlusSquare style={{ width: '27px', height: '27px' }} />, label: '릴스' },
    { icon: <FaRegPaperPlane style={{ width: '27px', height: '27px' }} />, label: '메세지' },
    { icon: <FaHeart style={{ width: '27px', height: '27px' }} />, label: '알림' },
    { icon: <FaRegSquarePlus style={{ width: '27px', height: '27px' }} />, label: '만들기', onClick: () => console.log(user) },
    { icon: <img src ={DefaultPfP} style={{width : "27px" , height : "27px" , borderRadius : "100%"}} />, label: '프로필', onClick: () => navigate(`/${user.username}`) },
  ];

  return (
    <div className="layout-wrapper">
      <div className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
        <div className="logo">
          {!collapsed && <h2 className="instagram-title">Instagram</h2>}
          <FaInstagram className="instagram-icon" />
        </div>

        {menuItems.map((item, idx) => (
           <div key={idx} className="panel" onClick={item.onClick}>
            <div className="icon">{item.icon}</div>
            <span className="label">{item.label}</span>
          </div>
        ))}
      </div>

      <div className={`search-panel ${collapsed ? 'show' : 'hide'}`}>
        <Search />
      </div>
    </div>
  );
}
