import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Consumer } from "../context";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    textDecoration: "none",
    color: "inherit",
  },
  image: {
    width: 100,
    height: 100,
  },
  cell: {},
}));

export default function Notice({ value }) {
  const classes = useStyles();
  return (
    <Link className={classes.container} to={"/notice/" + value.item_notice_id}>
      <div className={classes.cell}>
        <img
          src={
            value.fname
              ? "/static/images/" + value.fname
              : "/static/iamges/no_image.png"
          }
          className={classes.image}
        />
      </div>
      <div className={classes.cell}>
        <p>Title:{value.title}</p>
      </div>
      <div className={classes.cell}>
        <p>Colour:{value.colour ? value.colour : "Not specified"}</p>{" "}
      </div>
      <div className={classes.cell}>
        <p>Place:{value.place ? value.place : "Not specified"}</p>{" "}
      </div>
      <div className={classes.cell}>
        <p>Date:{value.date_created ? value.date_created : "Not specified"}</p>
      </div>
      <div className={classes.cell}>
        <p>Sent by: {value.username}</p>
      </div>
    </Link>
  );
}
