export default function UserIdentifier(
  {
    user,
    className = ""
  }) {
  return (
    <article className={`user-identifier default flex-row ${className}`} >
      <img
        className="user-image"
        src={user.img}
        alt={user.firstName}
      />
      <p className="user-name l-heading">
        {user.firstName}
      </p>
    </article >
  );
}

function UserPreview(
  {
    user,
    className = ""
  }) {
  return (
    <article className={`user-identifier preview flex-row ${className}`}>
      <img
        className="user-image"
        src={user.img}
        alt={user.firstName}
      />
      <div className="user-details flex-clm">
        <p className="user-name s-text">
          {user.firstName} {user.lastName}
        </p>
        <p className="user-skills xs-text">
          {user.skills}
        </p>
      </div>
    </article>
  );
}

export { UserIdentifier, UserPreview }; 