import React from "react";
import { Outlet } from "react-router-dom";
import { MobileHeader } from "../header/mobile/Index";
import { DesktopHeader } from "../header/desktop/Index";
import { Footer } from "../footer/Index";
import styles from "./styles.module.scss";
import MediaQuery from 'react-responsive';

export function Layout() {
  return (
    <div>
      {/* Mobile view */}
      <MediaQuery maxWidth={1223}>
        <div className={styles.layoutContainer}>
          <MobileHeader className={styles.header} />
          <main className={styles.content}>
            <Outlet />
          </main>
          <Footer className={styles.footer} />
        </div>
      </MediaQuery>

      {/* Desktop View */}
      <MediaQuery minWidth={1224}>
        <div className={styles.desktopLayoutContainer}>
          <DesktopHeader className={styles.desktopHeader} />
          <main className={styles.desktopContent}>
            <Outlet />
          </main>
        </div>
      </MediaQuery>
    </div>
  );
}
