import React from "react";
import Logo from "./Logo";
import Input from "./Input";
import Notifications from "./NotificationFeed";
import Menu from "./Menu";

export default function Navigation() {
  return (
    <header className="grid" role="banner">
      <Logo className="element-xl" />
      <nav className="grid" aria-label="Main navigation">
        <Input />
        <Notifications />
        <Menu />
      </nav>
    </header>
  );
}
