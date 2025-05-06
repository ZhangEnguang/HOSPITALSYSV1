import React from "react";

interface IconProps {
  className?: string;
}

// 大鼠图标
export const RatIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    stroke="currentColor"
    className={className}
  >
    <path 
      d="M12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6Z" 
      fill="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M3 8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8Z" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M4 19L7 16" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M20 19L17 16" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M15 15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// 小鼠图标
export const MouseIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    stroke="currentColor"
    className={className}
  >
    <path 
      d="M12 6C10.6193 6 9.5 7.11929 9.5 8.5C9.5 9.88071 10.6193 11 12 11C13.3807 11 14.5 9.88071 14.5 8.5C14.5 7.11929 13.3807 6 12 6Z" 
      fill="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M5 9C5 6.23858 7.23858 4 10 4H14C16.7614 4 19 6.23858 19 9V15C19 17.7614 16.7614 20 14 20H10C7.23858 20 5 17.7614 5 15V9Z" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M4 19L7 16" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M20 19L17 16" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M14 14C14 15.1046 13.1046 16 12 16C10.8954 16 10 15.1046 10 14" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// 兔子图标
export const RabbitIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    stroke="currentColor"
    className={className}
  >
    <path 
      d="M12 4C9.79086 4 8 5.79086 8 8V12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12V8C16 5.79086 14.2091 4 12 4Z" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M8 9H6C4.89543 9 4 9.89543 4 11V11C4 12.1046 4.89543 13 6 13H8" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M16 9H18C19.1046 9 20 9.89543 20 11V11C20 12.1046 19.1046 13 18 13H16" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 16V19" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M9 20L12 19L15 20" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <circle cx="10" cy="8" r="1" fill="currentColor" />
    <circle cx="14" cy="8" r="1" fill="currentColor" />
  </svg>
);

// 猴子图标
export const MonkeyIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    stroke="currentColor"
    className={className}
  >
    <path 
      d="M12 3C8.68629 3 6 5.68629 6 9C6 11.2173 7.26367 13.1379 9.14286 14.1429L9 19L12 17L15 19L14.8571 14.1429C16.7363 13.1379 18 11.2173 18 9C18 5.68629 15.3137 3 12 3Z" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M18 9C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <circle cx="10" cy="8" r="1" fill="currentColor" />
    <circle cx="14" cy="8" r="1" fill="currentColor" />
    <path 
      d="M10 11C10 11 11 12 12 12C13 12 14 11 14 11" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// 猪图标
export const PigIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    stroke="currentColor"
    className={className}
  >
    <path 
      d="M9 10C9 9.44772 9.44772 9 10 9H14C14.5523 9 15 9.44772 15 10V13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13V10Z" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M7 10.5V13C7 15.7614 9.23858 18 12 18C14.7614 18 17 15.7614 17 13V10.5" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M4 10H7" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M17 10H20" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M7 10C7 7.23858 9.23858 5 12 5C14.7614 5 17 7.23858 17 10" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <circle cx="9.5" cy="7.5" r="0.5" fill="currentColor" />
    <circle cx="14.5" cy="7.5" r="0.5" fill="currentColor" />
    <path 
      d="M11.5 12C11.5 12.2761 11.7239 12.5 12 12.5C12.2761 12.5 12.5 12.2761 12.5 12C12.5 11.7239 12.2761 11.5 12 11.5C11.7239 11.5 11.5 11.7239 11.5 12Z" 
      fill="currentColor"
    />
  </svg>
);

// 犬类图标
export const DogIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    stroke="currentColor"
    className={className}
  >
    <path 
      d="M10 5.23607C10 4.47852 10.8654 4.08334 11.4472 4.52786L20.7813 11.2918C21.4403 11.8001 21.4403 12.8284 20.7813 13.3367L11.4472 20.1006C10.8654 20.5451 10 20.1499 10 19.3924V5.23607Z" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M3 8.5V15.5" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M7 8.5V15.5" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M3 12H7" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <circle cx="13" cy="9" r="1" fill="currentColor" />
    <path 
      d="M13 16L16 13" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
); 