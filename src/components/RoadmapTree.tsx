import { useState } from 'react';
import { roadmapClusters, type RoadmapNode } from './roadmap-data';

/**
 * Visual roadmap of the Spring Boot ecosystem.
 * Clusters of concepts grouped by domain; nodes link to published pages or indicate "coming soon."
 */
export default function RoadmapTree() {
	return (
		<div className="bm-roadmap not-content">
			<div className="bm-roadmap__grid">
				{roadmapClusters.map((cluster) => (
					<ClusterCard key={cluster.id} cluster={cluster} />
				))}
			</div>
			<p className="bm-roadmap__legend">
				<span className="bm-chip bm-chip--available">Available</span>
				<span className="bm-chip bm-chip--soon">Coming soon</span>
			</p>
		</div>
	);
}

function ClusterCard({ cluster }: { cluster: (typeof roadmapClusters)[number] }) {
	return (
		<section className="bm-cluster" aria-labelledby={`cluster-${cluster.id}`}>
			<header className="bm-cluster__header">
				<h3 id={`cluster-${cluster.id}`} className="bm-cluster__title">
					{cluster.label}
				</h3>
				<p className="bm-cluster__caption">{cluster.caption}</p>
			</header>
			<ul className="bm-cluster__nodes" role="list">
				{cluster.nodes.map((node) => (
					<li key={node.id}>
						<NodeItem node={node} />
					</li>
				))}
			</ul>
		</section>
	);
}

function NodeItem({ node }: { node: RoadmapNode }) {
	const [hovered, setHovered] = useState(false);
	const isAvailable = node.status === 'available';

	const body = (
		<>
			<span className="bm-node__label">{node.label}</span>
			{!isAvailable && <span className="bm-node__badge">Soon</span>}
		</>
	);

	const classes = `bm-node ${isAvailable ? 'bm-node--available' : 'bm-node--soon'}`;

	return (
		<div
			className="bm-node__wrapper"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			onFocus={() => setHovered(true)}
			onBlur={() => setHovered(false)}
		>
			{isAvailable ? (
				<a className={classes} href={node.href}>
					{body}
				</a>
			) : (
				<span className={classes} tabIndex={0} aria-disabled="true">
					{body}
				</span>
			)}
			{hovered && <span className="bm-node__tooltip">{node.description}</span>}
		</div>
	);
}
