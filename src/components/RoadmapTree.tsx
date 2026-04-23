import { useState, useRef, useCallback } from 'react';
import { roadmapClusters, type RoadmapCluster, type RoadmapNode } from './roadmap-data';
import MapSelector from './MapSelector';

/**
 * Visual roadmap tree (roadmap.sh-inspired), rendered as SVG.
 *
 * Layout: two columns.
 *   Left column:  cluster stations, stacked vertically.
 *   Right column: children of each cluster, fanning out horizontally from their parent.
 *   Root "Spring Boot" node sits centered at the top of the left column.
 *   Curved SVG paths connect each cluster's right edge to each of its children's left edge.
 *
 * Tooltips render as DOM elements positioned absolutely over the SVG — this avoids the
 * viewBox-clipping issue that would otherwise cut off tooltips near the SVG's right edge.
 *
 * Below the SVG: a categorized list fallback for mobile (< 768px) and assistive tech.
 */

const CLUSTER_X = 0;
const CLUSTER_WIDTH = 220;
const CLUSTER_HEIGHT = 56;

const CHILD_X = 320;
const CHILD_WIDTH = 260;
const CHILD_HEIGHT = 42;
const CHILD_Y_SPACING = 56;

const ROOT_Y = 8;
const ROOT_WIDTH = 220;
const ROOT_HEIGHT = 56;
const ROOT_X = CLUSTER_X;

const CLUSTER_GAP = 40;
const FIRST_CLUSTER_Y = ROOT_Y + ROOT_HEIGHT + 48;

const CLUSTER_COLORS = [
	'var(--bm-cluster-1)',
	'var(--bm-cluster-2)',
	'var(--bm-cluster-3)',
	'var(--bm-cluster-4)',
	'var(--bm-cluster-5)',
	'var(--bm-cluster-6)',
	'var(--bm-cluster-7)',
];

function computeLayout() {
	const clusterCenterYs: number[] = [];
	let y = FIRST_CLUSTER_Y;
	for (const cluster of roadmapClusters) {
		const childrenHeight = cluster.nodes.length * CHILD_Y_SPACING;
		const rowHeight = Math.max(CLUSTER_HEIGHT, childrenHeight);
		clusterCenterYs.push(y + rowHeight / 2);
		y += rowHeight + CLUSTER_GAP;
	}
	return { clusterCenterYs, totalHeight: y + 20 };
}

const { clusterCenterYs, totalHeight } = computeLayout();
const SVG_WIDTH = CHILD_X + CHILD_WIDTH + 40;
const SVG_HEIGHT = totalHeight;

const ROOT_CONNECTOR_START_Y = ROOT_Y + ROOT_HEIGHT;
const ROOT_CONNECTOR_END_Y = clusterCenterYs[0] - CLUSTER_HEIGHT / 2;
const ROOT_CONNECTOR_X = CLUSTER_X + CLUSTER_WIDTH / 2;

interface TooltipState {
	readonly description: string;
	readonly anchorSvgX: number;
	readonly anchorSvgY: number;
}

export default function RoadmapTree() {
	const [tooltip, setTooltip] = useState<TooltipState | null>(null);
	const [selectedMap, setSelectedMap] = useState('spring-boot');
	const svgRef = useRef<SVGSVGElement>(null);

	const showTooltip = useCallback((node: RoadmapNode, x: number, y: number) => {
		setTooltip({ description: node.description, anchorSvgX: x, anchorSvgY: y });
	}, []);

	const hideTooltip = useCallback(() => {
		setTooltip(null);
	}, []);

	// Translate SVG coordinates to pixel coordinates relative to the container.
	// Used for DOM-positioned tooltip.
	const tooltipStyle = tooltip && svgRef.current
		? (() => {
				const rect = svgRef.current.getBoundingClientRect();
				const scaleX = rect.width / SVG_WIDTH;
				const scaleY = rect.height / SVG_HEIGHT;
				return {
					left: `${tooltip.anchorSvgX * scaleX}px`,
					top: `${tooltip.anchorSvgY * scaleY}px`,
				};
			})()
		: undefined;

	return (
		<div className="bm-roadmap not-content">
			<div className="bm-roadmap__toolbar">
				<MapSelector selectedId={selectedMap} onSelect={setSelectedMap} />
			</div>
			<div className="bm-roadmap__svg-wrapper">
				{/* eslint-disable-next-line jsx-a11y/prefer-tag-over-role */}
				<svg
					ref={svgRef}
					className="bm-roadmap__svg"
					viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
					role="img"
					aria-label="Spring Boot ecosystem roadmap"
				>
					{/* Root node: "Spring Boot" */}
					<g className="bm-svg-root">
						<rect x={ROOT_X} y={ROOT_Y} width={ROOT_WIDTH} height={ROOT_HEIGHT} rx={10} />
						<text
							x={ROOT_X + ROOT_WIDTH / 2}
							y={ROOT_Y + ROOT_HEIGHT / 2}
							textAnchor="middle"
							dominantBaseline="central"
						>
							Spring Boot
						</text>
					</g>

					{/* Connector from root to first cluster */}
					<line
						x1={ROOT_CONNECTOR_X}
						y1={ROOT_CONNECTOR_START_Y}
						x2={ROOT_CONNECTOR_X}
						y2={ROOT_CONNECTOR_END_Y}
						className="bm-svg-root-connector"
					/>

					{/* Cluster stations + their children */}
					{roadmapClusters.map((cluster, i) => (
						<ClusterGroup
							key={cluster.id}
							cluster={cluster}
							centerY={clusterCenterYs[i]}
							color={CLUSTER_COLORS[i % CLUSTER_COLORS.length]}
							isLast={roadmapClusters.at(-1) === cluster}
							nextCenterY={clusterCenterYs[i + 1]}
							onNodeHover={showTooltip}
							onNodeLeave={hideTooltip}
						/>
					))}
				</svg>
				{tooltip && tooltipStyle && (
					<div className="bm-roadmap__tooltip" style={tooltipStyle}>
						{tooltip.description}
					</div>
				)}
			</div>

			<div className="bm-roadmap__fallback">
				<ul className="bm-roadmap__fallback-list">
					{roadmapClusters.map((cluster) => (
						<li key={cluster.id} className="bm-fallback-cluster">
							<h3 className="bm-fallback-cluster__title">{cluster.label}</h3>
							<p className="bm-fallback-cluster__caption">{cluster.caption}</p>
							<ul className="bm-fallback-nodes">
								{cluster.nodes.map((node) => (
									<li key={node.id}>
										<FallbackNodeItem node={node} />
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>
			</div>

			<p className="bm-roadmap__legend">
				<span className="bm-chip bm-chip--available">Available</span>
				<span className="bm-chip bm-chip--soon">Coming soon</span>
			</p>
		</div>
	);
}

interface ClusterGroupProps {
	readonly cluster: RoadmapCluster;
	readonly centerY: number;
	readonly color: string;
	readonly isLast: boolean;
	readonly nextCenterY?: number;
	readonly onNodeHover: (node: RoadmapNode, svgX: number, svgY: number) => void;
	readonly onNodeLeave: () => void;
}

function ClusterGroup({
	cluster,
	centerY,
	color,
	isLast,
	nextCenterY,
	onNodeHover,
	onNodeLeave,
}: ClusterGroupProps) {
	const clusterY = centerY - CLUSTER_HEIGHT / 2;
	const clusterRightX = CLUSTER_X + CLUSTER_WIDTH;

	const n = cluster.nodes.length;
	const childYs = cluster.nodes.map(
		(_, j) => centerY + (j - (n - 1) / 2) * CHILD_Y_SPACING - CHILD_HEIGHT / 2,
	);

	return (
		<g className="bm-svg-cluster">
			{cluster.nodes.map((node, j) => {
				const startX = clusterRightX;
				const startY = centerY;
				const endX = CHILD_X;
				const endY = childYs[j] + CHILD_HEIGHT / 2;
				const midX = (startX + endX) / 2;
				const d = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
				return (
					<path
						key={`path-${node.id}`}
						d={d}
						className={`bm-svg-connector ${
							node.status === 'available' ? 'bm-svg-connector--available' : 'bm-svg-connector--soon'
						}`}
						fill="none"
						style={node.status === 'available' ? { stroke: color } : undefined}
					/>
				);
			})}

			{!isLast && nextCenterY !== undefined && (
				<line
					x1={CLUSTER_X + CLUSTER_WIDTH / 2}
					y1={clusterY + CLUSTER_HEIGHT}
					x2={CLUSTER_X + CLUSTER_WIDTH / 2}
					y2={nextCenterY - CLUSTER_HEIGHT / 2}
					className="bm-svg-progression-line"
				/>
			)}

			<rect
				x={CLUSTER_X}
				y={clusterY}
				width={CLUSTER_WIDTH}
				height={CLUSTER_HEIGHT}
				rx={10}
				className="bm-svg-cluster-box"
				style={{ fill: color }}
			/>
			<text
				x={CLUSTER_X + CLUSTER_WIDTH / 2}
				y={centerY}
				textAnchor="middle"
				dominantBaseline="central"
				className="bm-svg-cluster-label"
			>
				{cluster.label}
			</text>

			{cluster.nodes.map((node, j) => (
				<SvgNode
					key={node.id}
					node={node}
					x={CHILD_X}
					y={childYs[j]}
					color={color}
					onHover={onNodeHover}
					onLeave={onNodeLeave}
				/>
			))}
		</g>
	);
}

interface SvgNodeProps {
	readonly node: RoadmapNode;
	readonly x: number;
	readonly y: number;
	readonly color: string;
	readonly onHover: (node: RoadmapNode, svgX: number, svgY: number) => void;
	readonly onLeave: () => void;
}

function SvgNode({ node, x, y, color, onHover, onLeave }: SvgNodeProps) {
	const isAvailable = node.status === 'available';

	// Anchor the tooltip to the right edge of the child node in SVG coords
	// (the tooltip, being DOM-positioned, will overflow the SVG safely).
	const handleEnter = () => onHover(node, x + CHILD_WIDTH + 12, y);
	const handleLeave = () => onLeave();

	const body = (
		<g
			onMouseEnter={handleEnter}
			onMouseLeave={handleLeave}
			onFocus={handleEnter}
			onBlur={handleLeave}
			className={`bm-svg-node ${isAvailable ? 'bm-svg-node--available' : 'bm-svg-node--soon'}`}
			style={isAvailable ? { ['--cluster-color' as any]: color } : undefined}
		>
			<rect x={x} y={y} width={CHILD_WIDTH} height={CHILD_HEIGHT} rx={8} />
			<text
				x={x + 16}
				y={y + CHILD_HEIGHT / 2}
				dominantBaseline="central"
				className="bm-svg-node-label"
			>
				{node.label}
			</text>
			{!isAvailable && (
				<text
					x={x + CHILD_WIDTH - 16}
					y={y + CHILD_HEIGHT / 2}
					dominantBaseline="central"
					textAnchor="end"
					className="bm-svg-node-badge"
				>
					SOON
				</text>
			)}
		</g>
	);

	return isAvailable && node.href ? (
		<a href={node.href}>{body}</a>
	) : (
		<g aria-disabled="true">{body}</g>
	);
}

function FallbackNodeItem({ node }: { readonly node: RoadmapNode }) {
	const isAvailable = node.status === 'available';
	const body = (
		<>
			<span className="bm-fallback-node__label">{node.label}</span>
			{!isAvailable && <span className="bm-fallback-node__badge">Soon</span>}
		</>
	);
	const classes = `bm-fallback-node ${
		isAvailable ? 'bm-fallback-node--available' : 'bm-fallback-node--soon'
	}`;
	return isAvailable ? (
		<a className={classes} href={node.href}>
			{body}
		</a>
	) : (
		<span className={classes} aria-disabled="true">
			{body}
		</span>
	);
}
