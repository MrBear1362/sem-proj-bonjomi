export default function UserIdentifier({ user, className = "" }) {
  return (
    <article className={`user-identifier default flex-row ${className}`}>
      <img
        className="user-image"
        src={
          user.image_url ||
          "https://plus.unsplash.com/premium_photo-1739786996022-5ed5b56834e2?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        alt={user.first_name}
      />
      <p className="user-name l-heading">{user.first_name}</p>
    </article>
  );
}

function UserPreview({ user, className = "" }) {
  return (
    <article className={`user-identifier preview flex-row ${className}`}>
      <img
        className="user-image"
        src={
          user.image_url ||
          "https://plus.unsplash.com/premium_photo-1739786996022-5ed5b56834e2?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        alt={user.first_name}
      />
      <div className="user-details flex-clm">
        <p className="user-name s-text">
          {user.first_name} {user.last_name}
        </p>
        <p className="user-skills xs-text">{user.skills}</p>
      </div>
    </article>
  );
}

export { UserIdentifier, UserPreview };
