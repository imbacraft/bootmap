import { useState, useRef, useEffect } from 'react';

export interface MapOption {
	readonly id: string;
	readonly label: string;
	readonly status: 'available' | 'soon';
}

const MAPS: readonly MapOption[] = [
	{ id: 'spring-boot', label: 'Spring Boot', status: 'available' },
	{ id: 'java-core', label: 'Java Core', status: 'soon' },
	{ id: 'hibernate', label: 'Hibernate', status: 'soon' },
	{ id: 'jeps', label: 'JEPs', status: 'soon' },
];

interface MapSelectorProps {
	readonly selectedId: string;
	readonly onSelect: (id: string) => void;
}

export default function MapSelector({ selectedId, onSelect }: MapSelectorProps) {
	const [open, setOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

	const selected = MAPS.find((m) => m.id === selectedId) ?? MAPS[0];

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		}
		if (open) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => document.removeEventListener('mousedown', handleClickOutside);
		}
	}, [open]);

	return (
		<div className="bm-map-selector" ref={wrapperRef}>
			<button
				type="button"
				className="bm-map-selector__button"
				aria-haspopup="listbox"
				aria-expanded={open}
				onClick={() => setOpen((v) => !v)}
			>
				<span className="bm-map-selector__label">Map:</span>
				<span className="bm-map-selector__value">{selected.label}</span>
				<svg
					className={`bm-map-selector__chevron ${open ? 'is-open' : ''}`}
					width="12"
					height="12"
					viewBox="0 0 12 12"
					aria-hidden="true"
				>
					<path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</button>

			{open && (
				<ul className="bm-map-selector__menu" role="listbox">
					{MAPS.map((map) => {
						const isSelected = map.id === selectedId;
						const isDisabled = map.status === 'soon';
						return (
							<li key={map.id} role="option" aria-selected={isSelected}>
								<button
									type="button"
									className={`bm-map-selector__item ${isSelected ? 'is-current' : ''} ${isDisabled ? 'is-disabled' : ''}`}
									disabled={isDisabled}
									onClick={() => {
										if (!isDisabled) {
											onSelect(map.id);
											setOpen(false);
										}
									}}
								>
									<span className="bm-map-selector__item-label">{map.label}</span>
									{isDisabled && <span className="bm-map-selector__item-badge">Soon</span>}
								</button>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
