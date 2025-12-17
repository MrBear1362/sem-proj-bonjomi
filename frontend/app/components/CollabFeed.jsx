import React from "react";
import CollabCard from "../components/CollabCard.jsx";
import { NavLink, useLoaderData } from "react-router";
import Button from "./ui/buttons/Button.jsx";

export default function CollabFeed({ collabs: collabProp }) {
	const loaderData = useLoaderData();
	const collabs = collabProp ?? loaderData?.collabs;
	return (
		<section className="collab-feed wrapper">
			<h3>Collaboration requests</h3>
			<div className="collab-feed--container">
				{/* Using .map() to render each message - this is DYNAMIC RENDERING! */}
				{collabs?.length > 0 ?
					collabs.map((collab) => (
						<CollabCard key={collab.id} collab={collab} />
					))
				:	<p>No collabs yet</p>}
			</div>
			<Button className="btn-primary">
				<NavLink to="collab-feed" aria-label="Collab Feed">
					See more collabs
				</NavLink>
			</Button>
		</section>
	);
}
