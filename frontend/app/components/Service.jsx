import { Link } from "react-router";
import Bookmark from "../components/ui/Bookmark.jsx";
import Tag from "../components/ui/Tag.jsx";
import styles from "./Service.module.css";

/**
 * ServiceCard Component
 *
 * A flexible component that displays a service in either preview or detail mode.
 * - Preview mode: Shows compact card with limited content and "Read more" link
 * - Detail mode: Shows full card with all information and action buttons
 * - Uses the same styling with CSS classes that adapt to the mode
 */
export function ServiceCard({ service, mode = "preview" }) {
	const {
		id,
		title,
		content,
		user_profile_img,
		business_name,
		img_url,
		location,
		price,
		tags,
		created_at,
	} = service;

	const isDetailMode = mode === "detail";

	return (
		<section
			className={`${styles.serviceCardContainer} ${
				isDetailMode ? styles.serviceCardFull : ""
			}`}
		>
			<header>
				<div className={styles.profileContainer}>
					<img src={user_profile_img} alt="Business profile" />
					<p>{business_name}</p>
					<p>offers</p>
					<Tag type="static" label={tags} />
				</div>
				<div className={styles.bookmarkContainer}>
					<Bookmark />
				</div>
			</header>

			{!isDetailMode && <div className={styles.divider}></div>}

			<h3 className={styles.serviceTitle}>{title}</h3>
			<img className={styles.serviceMedia} src={img_url} alt={title} />
			<p className={styles.serviceDescription}>{content}</p>
			{
				isDetailMode ?
					// Detail mode: Show all info and action buttons
					<div className={styles.serviceDetails}>
						<div className={styles.actionButtons}>
							<button className={styles.contactButton}>Start a chat</button>
							<Link to={`/services/${id}/edit`} className={styles.editButton}>
								Edit Service
							</Link>
						</div>
						<div className={styles.infoContainer}>
							<p className={styles.location}>
								<strong>Location:</strong> {location}
							</p>
							<p className={styles.price}>
								<strong>Price:</strong> {price}
							</p>
						</div>
						<div className={styles.reviewContainer}>
							<p>
								<strong>Previous reviews:</strong>
								<p>Review component goes here</p>
							</p>
						</div>
					</div>
					// Preview mode: Show link and basic info
				:	<div className={styles.bottomContainer}>
						<div className={styles.linkContainer}>
							<Link to={`/services/${id}`} className={styles.readMore}>
								Read more
							</Link>
						</div>
						<div className={styles.infoContainer}>
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
