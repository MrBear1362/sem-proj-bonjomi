import { Link } from "react-router";
import Bookmark from "../components/ui/Bookmark.jsx";
import Tag from "../components/ui/Tag.jsx";
import "./Service.css";

/**
 * ServicePreviewCard Component
 *
 * Displays a compact preview of a service.
 * - Shows business profile information
 * - Displays service title, image, and description
 * - Includes bookmark functionality
 * - "Read more" link navigates to full service details
 */
export function ServicePreviewCard({ service }) {
	const {
		id,
		title,
		content,
		user_profile_img,
		business_name,
		img_url,
		location,
		tags,
	} = service;

	return (
		<section className="service-card-container">
			<header>
				<div className="profile-container">
					<img src={user_profile_img} alt="Business profile" />
					<h3>{business_name}</h3>
					<p>offers</p>
					<Tag type="static" label={tags} />
				</div>
				<div className="bookmark-container">
					<Bookmark />
				</div>
			</header>
			<h2>{title}</h2>
			<img className="service-media" src={img_url} alt={title} />
			<p className="service-description">{content}</p>
			<div className="bottom-container">
				<div className="link-container">
					<Link to={`/services/${id}`} className="read-more">
						Read more
					</Link>
				</div>
				<div className="info-container">
					<p>{location}</p>
					<p> posted at</p>
				</div>
			</div>
		</section>
	);
}

/**
 * ServiceDetailCard Component
 *
 * Displays the full details of a service.
 * - Shows all service information (title, description, price, tags)
 * - Includes business profile and bookmark functionality
 * - Displays formatted location and posting date
 * - Provides action button to contact the business
 */
export function ServiceDetailCard({ service }) {
	const {
		id,
		title,
		content,
		user_profile_img,
		business_name,
		img_url,
		location,
		price,
		created_at,
	} = service;
	return (
		<section className="service-card-container service-card-full">
			<header>
				<div className="profile-container">
					<img src={user_profile_img} alt="Business profile" />
					<h3>{business_name}</h3>
				</div>
				<div className="bookmark-container">
					<Bookmark />
				</div>
			</header>
			<h2>{title}</h2>
			<img className="service-media" src={img_url} alt={title} />
			<div className="service-details">
				<p className="service-description">{content}</p>
				<div className="action-buttons">
					<button className="contact-button">Start a chat</button>
					<Link to={`/services/${id}/edit`} className="edit-button">
						Edit Service
					</Link>
				</div>
				<div className="info-container">
					<p className="location">
						<strong>Location:</strong> {location}
					</p>
					<p className="price">
						<strong>Price:</strong> {price}
					</p>
					<p className="date">
						<strong>Posted:</strong>
					</p>
				</div>
			</div>
		</section>
	);
}
