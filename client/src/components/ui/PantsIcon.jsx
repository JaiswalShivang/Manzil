export const PantsIcon = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M5 3h14l.5 6-1 12h-5l-1.5-10-1.5 10h-5l-1-12 .5-6z" />
    <path d="M5 7h14" />
    <path d="M12 7v4" />
  </svg>
);

export default PantsIcon;
