import React from "react";
import Button from "./ui/buttons/Button";
import { NavLink } from "react-router";

export default function Footer() {
  return (
    <nav className="footer__nav flex">
      <Button className="flex-clm btn-nav">
        <NavLink to="/" aria-label="Home">
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
            className="element-s"
          >
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
            <path d="M9 21v-6h6v6" />
          </svg>
          <p>Home</p>
        </NavLink>
      </Button>
      <Button className="flex-clm btn-nav">
        <NavLink
          to="services"
          className="flex-clm btn-nav"
          aria-label="Services"
        >
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
            className="element-s"
          >
            <path d="M3 9h18" />
            <path d="M4 9l1.5-4.5h13L20 9" />
            <path d="M5 9v10h14V9" />
            <path d="M9 19v-6h6v6" />
          </svg>
          <p>Services</p>
        </NavLink>
      </Button>
      <Button className="flex-clm btn-nav">
        <NavLink
          to="create-posts"
          className="flex-clm btn-nav"
          aria-label="Create"
        >
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
            className="element-s"
          >
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <p>Create</p>
        </NavLink>
      </Button>
      <Button className="flex-clm btn-nav">
        <NavLink
          to="messages"
          className="flex-clm btn-nav"
          aria-label="messages"
        >
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
            className="element-s"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="8" y1="9" x2="16" y2="9" />
            <line x1="8" y1="12" x2="14" y2="12" />
          </svg>
          <p>Chats</p>
        </NavLink>
      </Button>
      <Button className="flex-clm btn-nav">
        <NavLink to="profile" className="flex-clm btn-nav" aria-label="Profile">
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
            className="element-s"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c1.5-3 4.5-5 8-5s6.5 2 8 5" />
          </svg>
          <p>Profile</p>
        </NavLink>
      </Button>
    </nav>
  );
}
