import React from "react";
import { Link } from "react-router-dom";

interface SecondaryButtonProps {
  label: string;
  dataText?: string;
  onClick?: () => void;
  to?: string;
  href?: string;
  className?: string;
  compact?: boolean;
  variant?: "sm" | "details";
  style?: React.CSSProperties;
  ariaHidden?: boolean;
}

const arrowContent = (
  <span className="btnSecondary14Arrow" aria-hidden="true">
    <svg className="btnSecondary14ArrowLineSvg" viewBox="0 0 100 16" fill="none">
      <line
        x1="0"
        y1="8"
        x2="100"
        y2="8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="butt"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
    <svg
      className="btnSecondary14ArrowHeadSvg"
      viewBox="0 0 18 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M0 3 L12 8 L0 13" vectorEffect="non-scaling-stroke" />
    </svg>
  </span>
);

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  label,
  dataText,
  onClick,
  to,
  href,
  className,
  compact,
  variant,
  style,
  ariaHidden,
}) => {
  const variantClass = variant
    ? `btnSecondary14--${variant}`
    : compact
      ? "btnSecondary14--sm"
      : "";

  const classes = [
    "btnSecondary btnSecondary14",
    variantClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span className="btnSecondary14Text" data-text={dataText ?? label}>
        {label}
      </span>
      {arrowContent}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} style={style}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} style={style}>
        {content}
      </a>
    );
  }

  if (ariaHidden) {
    return (
      <div className={classes} style={style} aria-hidden="true">
        {content}
      </div>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} style={style}>
      {content}
    </button>
  );
};

export default SecondaryButton;
