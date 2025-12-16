import { Link } from "react-router";
import { useCurrentUser } from "../library/utils.js";
import Bookmark from "../components/ui/buttons/Bookmark.jsx";
import Tag from "../components/ui/buttons/Tag.jsx";
import Button from "../components/ui/buttons/Button.jsx";

/**
 * ServiceCard Component
 *
 * A flexible component that displays a service in either preview or detail mode.
 * - Preview mode: Shows compact card with limited content and "Read more" link
 * - Detail mode: Shows full card with all information and action buttons
 * - Only shows edit button if current user is the service owner
 */
export function ServiceCard({ service, mode = "preview" }) {
	const currentUserId = useCurrentUser();

	const {
		id,
		title,
		content,
		user_profile_img,
		business_name,
		business_id,
		img_url,
		location,
		price,
		tags,
		created_at,
	} = service;

	const isDetailMode = mode === "detail";
	const isOwner = currentUserId && business_id === currentUserId;

	return (
		<section
			className={`serviceCardContainer ${
				isDetailMode ? "serviceCardFull" : ""
			}`}
		>
			<header>
				<div className="profileContainer">
					<img src={user_profile_img} alt="Business profile" />
					<p>{business_name}</p>
					<p>offers</p>
					<Tag type="static" label={tags} />
				</div>
				<div className="bookmarkContainer">
					<Bookmark />
				</div>
			</header>

			{!isDetailMode && <div className="divider"></div>}

			<h3 className="serviceTitle">{title}</h3>
			<img className="serviceMedia" src={img_url} alt={title} />
			<p className="serviceDescription">{content}</p>
			{
				isDetailMode ?
					// Detail mode: Show all info and action buttons
					<div className="serviceDetails">
						<div className="actionButtons">
							<Button className="btn-primary">Start a chat</Button>
							{isOwner && (
								<Link to={`/services/${id}/edit`} className="editButton">
									Edit Service
								</Link>
							)}
						</div>
						<div className="infoContainer">
							<p className="location">
								<strong>Location:</strong> {location}
							</p>
							<p className="price">
								<strong>Pricing:</strong>
								<br /> {price}
							</p>
						</div>
						<div className="reviewContainer">
							<p>
								<strong>Previous reviews:</strong>
							</p>
							<p>Review component goes here</p>
						</div>
					</div>
					// Preview mode: Show link and basic info
				:	<div className="bottomContainer">
						<div className="linkContainer">
							<Link to={`/services/${id}`} className="readMore">
								Read more
							</Link>
						</div>
						<div className="infoContainer">
							<p>{location} - posted at</p>
						</div>
					</div>

			}
		</section>
	);
}

// Export convenience components that use the same underlying component
export function ServicePreviewCard({ service }) {
	return <ServiceCard service={service} mode="preview" />;
}

export function ServiceDetailCard({ service }) {
	return <ServiceCard service={service} mode="detail" />;
}
