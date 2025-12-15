import { Link } from "react-router";
import Bookmark from "./ui/Bookmark.jsx";
import Tag from "./ui/Tag.jsx";
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
  return (
    <section className="service-card-container">
      <header>
        <div className="profile-container">
          <img src={service.user_profile_img} alt="Business profile" />
          <h3>{service.business_name}</h3>
          <p>offers</p>
          <Tag type="static" />
        </div>
        <div className="bookmark-container">
          <Bookmark />
        </div>
      </header>
      <h2>{service.title}</h2>
      <img
        className="service-media"
        src={service.img_url}
        alt={service.title}
      />
      <p className="service-description">{service.content}</p>
      <div className="bottom-container">
        <div className="link-container">
          <Link to={`/services/${service.id}`} className="read-more">
            Read more
          </Link>
        </div>
        <div className="info-container">
          <p>{service.location}</p>
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
  return (
    <section className="service-card-container service-card-full">
      <header>
        <div className="profile-container">
          <img src={service.user_profile_img} alt="Business profile" />
          <h3>{service.business_name}</h3>
        </div>
        <div className="bookmark-container">
          <Bookmark />
        </div>
      </header>
      <h2>{service.title}</h2>
      <img
        className="service-media"
        src={service.img_url}
        alt={service.title}
      />
      <div className="service-details">
        <p className="service-description">{service.content}</p>
        <div className="info-container">
          <p className="location">
            <strong>Location:</strong> {service.location}
          </p>
          <p className="price">
            <strong>Price:</strong> ${service.price}
          </p>
          <p className="date">
            <strong>Posted:</strong>{" "}
            {new Date(service.created_at).toLocaleDateString()}
          </p>
          {service.tags && (
            <p className="tags">
              <strong>Tags:</strong> {service.tags}
            </p>
          )}
        </div>
      </div>
      <div className="action-buttons">
        <button className="contact-button">Contact Business</button>
      </div>
    </section>
  );
}
