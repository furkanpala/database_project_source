import React from "react";
import { makeStyles } from "@material-ui/core";
import ToolBar from "./ToolBar";
import Notice from "./Notice";
import { Consumer } from "../context";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
  },
  notices: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
}));

export default function Home() {
  const classes = useStyles();
  return (
    <Consumer>
      {({ notices }) => (
        <div className={classes.container}>
          <ToolBar />
          <div className={classes.notices}>
            {notices.map((value, key) => (
              <Notice value={value} key={key} />
            ))}
          </div>
        </div>
      )}
    </Consumer>
  );
}
