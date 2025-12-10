import React from "react";
/* import Logo from "./Logo"; */
import InputField from "./UI/InputField";
/* import Notifications from "./NotificationFeed";
import Menu from "./Menu"; */
import Like from "./UI/Like";

import "../app.css";
import "./noteCard.css";

export default function Navigation() {
  return (
    <header className="flex-space" role="banner">
      {/*       <img src="" alt="logo" className="element-xl" /> */}
      <h1>lineUp</h1>
      {/* <Logo className="element-xl" /> */}
      <nav className="flex" aria-label="Main navigation">
        <Like />
        <Like />
        <Like />
        {/*         <Notifications />
        <Menu /> */}
      </nav>
    </header>
  );
}
