export default function UserIdentifier({ user, className = "" }) {
  return (
    <article className={`user-identifier default flex-row ${className}`}>
      <img className="user-image" src={user.img} alt={user.first_name} />
      <p className="user-name l-heading">{user.first_name}</p>
    </article>
  );
}

function UserPreview({ user, className = "" }) {
  return (
    <article className={`user-identifier preview flex-row ${className}`}>
      <img className="user-image" src={user.img} alt={user.first_name} />
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
