import { cx } from "./cx";

export function Chevron({ open, reducedMotion }: { open: boolean; reducedMotion: boolean }) {
    return (
        <span
            className={cx(
                "inline-flex items-center justify-center w-4 h-4",
                reducedMotion ? "" : "transition-transform duration-300 ease-out",
                open ? "rotate-180" : "rotate-0"
            )}
            aria-hidden="true"
        >
            <svg className="block" viewBox="0 0 16 16" width="16" height="16" fill="none">
                <path
                    d="M3.5 6.25L8 10.25L12.5 6.25"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </span>
    );
}
