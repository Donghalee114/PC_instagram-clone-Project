import '../utills/followModal.css';
import type { User } from '../types/User';
import DefaultPfP from '../assets/Default_pfp.jpg'

type FollowModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string; // ex) "팔로워", "팔로잉"
  users: User[]; // 팔로우/팔로잉 목록 데이터
};

export default function FollowModal({ isOpen, onClose, title, users }: FollowModalProps) {
  if (!isOpen) return null;

  return (
    <div className="Modal" onClick={onClose}>
      <div className="Modal-top-container" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        <button onClick={onClose}>X</button>
      </div>

      <div className="Modal-list-container">
        {users.length === 0 ? (
          <p>{title} 목록이 없습니다.</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="Modal-list-item">
              <img
                src={user.profileimage || DefaultPfP}
                alt={`${user.username} 프로필 이미지`}
                className="Modal-list-profile-image"
              />
              <span>{user.username}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
