import { Avatar, Container, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Consumer } from "../context";
import { Redirect, useParams } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(4),
  },
  username: {
    marginTop: theme.spacing(2),
  },
  info: {
    padding: theme.spacing(2),
  },
}));

export default function Profile(props) {
  const classes = useStyles();
  const { username } = useParams();
  useEffect(() => {
    props.onMount(username);

    return () => {
      props.onUnmount();
    };
  }, [username]);
  return (
    <Consumer>
      {({
        isEditingProfile,
        userProfile,
        currentUser,
        handleProfileEditSave,
        handleProfileEdit,
        onChange,
        username,
        fname,
        lname,
        email,
        phoneNumber,
        handleFileSelect,
        selectedPPpath,
        fnameError,
        lnameError,
        usernameError,
        emailError,
        emailExists,
        usernameExists,
        phoneNumberExists,
      }) => (
        <>
          {userProfile === -1 ? null : (
            <>
              {userProfile === null ? (
                <Redirect to="/" />
              ) : (
                <Container maxWidth="xs">
                  {currentUser === null ? null : (
                    <div className={classes.container}>
                      <Avatar
                        className={classes.large}
                        src={
                          userProfile.profile_picture
                            ? "/static/images/" +
                              userProfile.profile_picture.filename
                            : null
                        }
                      />
                      {usernameExists ? (
                        <Typography color="secondary">
                          Username already exists
                        </Typography>
                      ) : null}
                      {emailExists ? (
                        <Typography color="secondary">
                          Email already exists
                        </Typography>
                      ) : null}
                      {phoneNumberExists ? (
                        <Typography color="secondary">
                          Phone number already exists
                        </Typography>
                      ) : null}
                      {usernameError !== "" ? (
                        <Typography color="secondary">
                          {usernameError}
                        </Typography>
                      ) : null}
                      {fnameError !== "" ? (
                        <Typography color="secondary">{fnameError}</Typography>
                      ) : null}
                      {lnameError !== "" ? (
                        <Typography color="secondary">{lnameError}</Typography>
                      ) : null}
                      {emailError !== "" ? (
                        <Typography color="secondary">{emailError}</Typography>
                      ) : null}
                      {isEditingProfile ? (
                        <TextField
                          variant="outlined"
                          value={username}
                          label="Username"
                          name="username"
                          className={classes.username}
                          onChange={onChange}
                        />
                      ) : (
                        <Typography
                          component="h1"
                          variant="h4"
                          className={classes.username}
                        >
                          {userProfile.username}
                        </Typography>
                      )}

                      <Grid container spacing={2} className={classes.info}>
                        <Grid item xs={12} sm={6}>
                          {isEditingProfile ? (
                            <TextField
                              variant="outlined"
                              value={fname}
                              label="First Name"
                              name="fname"
                              onChange={onChange}
                            />
                          ) : (
                            <Typography>
                              First Name: {userProfile.fname}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          {isEditingProfile ? (
                            <TextField
                              variant="outlined"
                              value={lname}
                              label="Last Name"
                              name="lname"
                              onChange={onChange}
                            />
                          ) : (
                            <Typography>
                              Last Name: {userProfile.lname}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          {isEditingProfile ? (
                            <TextField
                              variant="outlined"
                              value={email}
                              label="Email"
                              name="email"
                              onChange={onChange}
                            />
                          ) : (
                            <Typography>Email: {userProfile.email}</Typography>
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          {isEditingProfile ? (
                            <TextField
                              variant="outlined"
                              value={phoneNumber}
                              label="Phone number"
                              name="phoneNumber"
                              onChange={onChange}
                            />
                          ) : (
                            <Typography>
                              Phone Number:
                              {userProfile.phoneNumber
                                ? userProfile.phoneNumber
                                : " Not specified"}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          <Typography>
                            Experience Level: {userProfile.experience_level}
                          </Typography>
                        </Grid>
                        {currentUser.user_id === userProfile.user_id ? (
                          <>
                            {isEditingProfile ? (
                              <>
                                <Grid item xs={12} sm={6}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                    onClick={handleProfileEditSave}
                                  >
                                    Save
                                  </Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <input
                                    type="file"
                                    name="pp"
                                    id="pp"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleFileSelect}
                                    value={selectedPPpath}
                                  ></input>
                                </Grid>
                              </>
                            ) : (
                              <>
                                <Grid item xs={12} sm={6}>
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<DeleteIcon />}
                                  >
                                    Delete
                                  </Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<EditIcon />}
                                    onClick={handleProfileEdit}
                                  >
                                    Edit
                                  </Button>
                                </Grid>
                              </>
                            )}
                          </>
                        ) : null}
                      </Grid>
                    </div>
                  )}
                </Container>
              )}
            </>
          )}
        </>
      )}
    </Consumer>
  );
}
