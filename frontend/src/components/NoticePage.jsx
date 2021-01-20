import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";
import { Consumer } from "../context";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

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
  outerContainer: {
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  comment1: {
    fontWeight: "700",
    color: "green",
  },
  comment2: {
    fontWeight: "700",
    color: "red",
  },
}));
export default function NoticePage({ onMount }) {
  const classes = useStyles();
  const { id } = useParams();
  useEffect(() => {
    onMount(id);
  }, []);
  return (
    <Consumer>
      {({
        notices,
        comment,
        onChange,
        handleCommentSubmit,
        comments,
        currentUser,
        handleNotHelpfulButton,
        handleHelpfulButton,
      }) => (
        <div className={classes.outerContainer}>
          <Link
            className={classes.container}
            to={
              "/notice/" +
              notices.find((notice) => {
                return notice.item_notice_id == id;
              }).item_notice_id
            }
          >
            <div className={classes.cell}>
              <img
                src={
                  notices.find((notice) => notice.item_notice_id == id).fname
                    ? "/static/images" +
                      notices.find((notice) => notice.item_notice_id == id)
                        .fname
                    : "/static/images/no_image.png"
                }
                className={classes.image}
              />
            </div>
            <div className={classes.cell}>
              <p>
                Title:
                {notices.find((notice) => notice.item_notice_id == id).title}
              </p>
            </div>
            <div className={classes.cell}>
              <p>
                Colour:
                {notices.find((notice) => notice.item_notice_id == id).colour
                  ? notices.find((notice) => notice.item_notice_id == id).colour
                  : "Not specified"}
              </p>{" "}
            </div>
            <div className={classes.cell}>
              <p>
                Place:
                {notices.find((notice) => notice.item_notice_id == id).place
                  ? notices.find((notice) => notice.item_notice_id == id).place
                  : "Not specified"}
              </p>{" "}
            </div>
            <div className={classes.cell}>
              <p>
                Date:
                {notices.find((notice) => notice.item_notice_id == id)
                  .date_created
                  ? notices.find((notice) => notice.item_notice_id == id)
                      .date_created
                  : "Not specified"}
              </p>
            </div>
            <div className={classes.cell}>
              <p>
                Sent by:{" "}
                {notices.find((notice) => notice.item_notice_id == id).username}
              </p>
            </div>
          </Link>
          <p>
            {
              notices.find((notice) => notice.item_notice_id == id)
                .notice_description
            }
          </p>
          <TextField
            variant="outlined"
            label="Comment"
            multiline
            rows="4"
            name="comment"
            value={comment}
            onChange={onChange}
          ></TextField>
          <Button
            variant="contained"
            onClick={handleCommentSubmit.bind(this, id)}
          >
            Send comment
          </Button>
          <ul>
            {comments.map((comment, key) => (
              <li
                key={key}
                className={
                  comment.helpful
                    ? classes.comment1
                    : comment.not_helpful
                    ? classes.comment2
                    : null
                }
              >
                {comment.content} <br /> Sent by: {comment.username}
                <br />
                {currentUser &&
                currentUser.username ==
                  notices.find((notice) => notice.item_notice_id == id)
                    .username &&
                !comment.helpful &&
                !comment.not_helpful ? (
                  <>
                    <Button
                      onClick={handleHelpfulButton.bind(
                        this,
                        comment.comment_id,
                        id
                      )}
                    >
                      Helpful
                    </Button>
                    <Button
                      onClick={handleNotHelpfulButton.bind(
                        this,
                        comment.comment_id,
                        id
                      )}
                    >
                      Not Helpful
                    </Button>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Consumer>
  );
}
