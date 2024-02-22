import { Link,useLocation } from "react-router-dom";
import styles from "./NavBar.module.css";
import React from 'react'
import { ReactComponent as HomeIcon } from "../assets/icons/home.svg";
import { ReactComponent as MenuIcon } from "../assets/icons/menu.svg";
import { ReactComponent as SettingIcon } from "../assets/icons/setting.svg";

export default function NavBar(){
  const {pathname} = useLocation()
 
  return(
    <div className={styles.navBar}>
      <div className={styles.homeIcon}>
        <Link to="/">
          <HomeIcon width={30} height={30} fill={pathname=='/'?'black':'#c4c4c4'}/>
        </Link>
      </div>
      <div className={styles.menuIcon}>
        <Link to="/lectures">
          <MenuIcon width={30} height={30} fill={pathname=='/lectures'?'black':'#c4c4c4'}/>
        </Link>
      </div>
      <div className={styles.settingIcon}>
        <Link to="/setting">
          <SettingIcon width={30} height={30} fill={pathname=='/setting'?'black':'#c4c4c4'}/>
        </Link>
      </div>
      </div>
    )
}