import '../utills/errorPage.css'
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div style={{width : "100%" , position : "fixed"  , display : "flex" , flexDirection : "column" , alignItems : "center" }}>
      
      <h1 style={{fontSize : "150px" , marginBottom : "0px"}}>404</h1>
      <h1 style={{ color: "white" }}>
        존재하지 않는 페이지 입니다.
      </h1>
    
      <h3 className="clickText" onClick={() => navigate('/')}>메인 페이지로 이동하기</h3>
      </div>

    </div>
  );
}
