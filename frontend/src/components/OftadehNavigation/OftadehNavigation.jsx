import React from "react";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";

import { saleNavigationconfig,accountNavigationconfig,adminNavigationconfig, superAdminNavigationconfig } from "../../oftadeh-configs/navigationConfig";

import OftadehNavGroup from "./sections/OftadehNavGroup";
import OftadehNavCollapse from "./sections/OftadehNavCollapse";
import OftadehNavItem from "./sections/OftadehNavItem";
import OftadehNavLink from "./sections/OftadehNavLink";
import { Typography } from "@material-ui/core";
import clsx from "clsx";
import { getRole } from "../../pages/auth/hepler/index"

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  logoBg: {
    backgroundColor: theme.palette.type !== "dark" && "#18202c",
    // backgroundColor: "#18202c"
  },
  logo: {
    padding: "1rem",
    "& span": {
      display: "block",
      color: "rgba(41, 113, 245, 0.87)",
    },
  },
  navCustom: {
    "& .MuiTypography-root": {
      fontSize: ".85rem",
    },
    "& .MuiListItemIcon-root": {
      minWidth: "35px",
    },
    "& .MuiCollapse-wrapperInner a": {
      paddingLeft: "50px",
    },
  },
}));

const OftadehNavigation = (props) => {
  const classes = useStyles(props);
  const userType = getRole();

  return (
    <div>
      <div className={clsx(classes.toolbar, classes.logoBg)}>
        <Typography
          className={classes.logo}
          variant="h6"
          component="h1"
          align="center"
        >
          &copy; Carepact
        </Typography>
      </div>
      <Divider />
     { (userType === "S") ?  <List className={classes.navCustom}>
        {saleNavigationconfig.map((item) => (
          <React.Fragment key={item.id}>
            {item.type === "group" && <OftadehNavGroup item={item} />}

            {item.type === "collapse" && <OftadehNavCollapse item={item} />}

            {item.type === "item" && <OftadehNavItem item={item} />}

            {item.type === "link" && <OftadehNavLink item={item} />}

            {item.type === "divider" && <Divider className="my-16" />}
          </React.Fragment>
        ))}
      </List> : ''}
      { (userType === "AC") ?  <List className={classes.navCustom}>
        {accountNavigationconfig.map((item) => (
          <React.Fragment key={item.id}>
            {item.type === "group" && <OftadehNavGroup item={item} />}

            {item.type === "collapse" && <OftadehNavCollapse item={item} />}

            {item.type === "item" && <OftadehNavItem item={item} />}

            {item.type === "link" && <OftadehNavLink item={item} />}

            {item.type === "divider" && <Divider className="my-16" />}
          </React.Fragment>
        ))}
      </List> : ''}
      { (userType === "A") ?  <List className={classes.navCustom}>
        {adminNavigationconfig.map((item) => (
          <React.Fragment key={item.id}>
            {item.type === "group" && <OftadehNavGroup item={item} />}

            {item.type === "collapse" && <OftadehNavCollapse item={item} />}

            {item.type === "item" && <OftadehNavItem item={item} />}

            {item.type === "link" && <OftadehNavLink item={item} />}

            {item.type === "divider" && <Divider className="my-16" />}
          </React.Fragment>
        ))}
      </List> : ''}
      { (userType === "SA") ?  <List className={classes.navCustom}>
        {superAdminNavigationconfig.map((item) => (
          <React.Fragment key={item.id}>
            {item.type === "group" && <OftadehNavGroup item={item} />}

            {item.type === "collapse" && <OftadehNavCollapse item={item} />}

            {item.type === "item" && <OftadehNavItem item={item} />}

            {item.type === "link" && <OftadehNavLink item={item} />}

            {item.type === "divider" && <Divider className="my-16" />}
          </React.Fragment>
        ))}
      </List> : ''}

     
    </div>
  );
};

export default OftadehNavigation;