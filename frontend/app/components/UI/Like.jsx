import { useFetcher } from "react-router";
import "./Like.css";

export default function Like({ noteId, likeCount, isLiked }) {
  /*   const [likeCount, setLikeCount] = useState(2);
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  }; */

  const fetcher = useFetcher();

  const handleLike = () => {
    fetcher.submit(
      {
        noteId,
        isLiked: isLiked.toString(),
      },
      { method: "post" }
    );
  };

  return (
    <div className="container">
      <button
        onClick={handleLike}
        className={`heart ${isLiked ? "heartActive" : ""}`}
      />
      {/* <button
        className={`heart ${isLiked ? "heartActive" : ""}`}
        //onClick={toggleLike}
        aria-label="Toggle like"
        name="intent"
        value="like"
        type="submit"
      /> */}
      <span className="likeCount">{likeCount || 0}</span>
    </div>
  );
}
