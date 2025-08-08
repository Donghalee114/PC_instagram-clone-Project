import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import defaultPfP from "../assets/Default_pfp.jpg";
import { useNavigate } from "react-router-dom";
import '../utills/SearchComponet.css'
import { supabase } from "../lib/supabaseClient";


export default function Search() {
  const [searchName, setSearchName] = useState('');
  const [results, setResults] = useState<{ id: string; username: string; profileimage: string  }[]>([]);
  const navigate = useNavigate()
  const user = useUser(); // 현재 로그인한 유저

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchName.trim() === "") {
        setResults([]);
        return;
      }

      const fetchUsers = async () => {
        const { data, error } = await supabase
          .from("users")
          .select("id, name, username, profileimage")
          .ilike("username", `%${searchName}%`);

        if (error) {
          console.error("검색 실패:", error.message);
          return;
        }

      const filtered = (data || []).filter(u => u.id !== user.user?.id);
      setResults(filtered);
        
      };

      fetchUsers();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchName , user]);

  return (
    <div style={{ padding: "20px" , display : "flex" , flexDirection : "column" , justifyContent : "flex-start" , position : "relative" , zIndex : "992299"}}>
      <input
        type="text"
        placeholder="유저 이름 검색"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        style={{ padding : "5px 20px" , width: "280px" , background :"#363636" , border : "1px solid #272626ff" , borderRadius : "20px"}}
      />

      <ul style={{ marginTop: "20px", color: "white" , padding : "0px" , borderTop : "1px solid #4e4d4dff"  }}>
        {results.map((user: any) => (
          <span onClick={() => navigate(`/${user.username}`)} className="userBox" key= {user.id}>
            <img src={user.profileimage || defaultPfP} style={{width : "50px" , borderRadius : "100%" , marginRight : "10px"}} />
            <div style={{display : "flex" , flexDirection : 'column'}}><span>{user.username}</span> <small style={{color : "gray"}}>{user.name}</small></div>
          </span>
            
        ))}
          {results.length === 0 && searchName.trim() !== "" && (
          <li style={{ color: "gray", padding: "10px 20px" }}>No data</li>
        )}
        
       
      </ul>
      
    </div>
  );
}
