import React from "react";
/* import Logo from "./Logo"; */
import InputField from "./ui/inputs/InputField";
/* import Notifications from "./NotificationFeed"; */
import Button from "./ui/buttons/Button";

export default function Navigation() {
  return (
    <header className="flex-space" role="banner">
      {/*       <img src="" alt="logo" className="element-xl" /> */}
      <h1>lineUp</h1>
      {/* <Logo className="element-xl" /> */}
      <nav className="flex" aria-label="Main navigation">
        <Button className="btn-nav">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="20"
            height="20"
            className="element-m"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </Button>
        <Button className="btn-nav">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="20"
            height="20"
            className="element-m"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </Button>
        <Button className="btn-nav">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="20"
            height="20"
            className="element-m"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </Button>
        {/*         <Notifications />
        <Menu /> */}
      </nav>
    </header>
  );
}
