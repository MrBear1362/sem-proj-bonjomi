import { useFetcher } from "react-router";
import "./Like.css";

export default function Comment({ commentCount = 0, isOpen, onClick }) {
  return (
    <div className="container">
      {/*       <button onClick={onClick}>
        💬 {commentCount}
      </button> */}
      <button
        onClick={onClick}
        className={`heart ${isOpen ? "commentActive" : ""}`}
      />
      <span className="likeCount">{commentCount}</span>
    </div>
  );
}
