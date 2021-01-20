import React, { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link as RouterLink } from "react-router-dom";
import { Consumer } from "../context";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp(props) {
  const classes = useStyles();
  useEffect(() => {
    return () => {
      props.onUnmount();
    };
  }, []);
  return (
    <Consumer>
      {({
        onChange,
        handleSignUpSubmit,
        fname,
        lname,
        username,
        password1,
        password2,
        email,
        fnameError,
        lnameError,
        usernameError,
        emailError,
        password1Error,
        password2Error,
        usernameExists,
        emailExists,
        signUpSuccsessful,
        handleFileSelect,
        selectedPPpath,
      }) => (
        <Container
          component="main"
          maxWidth="xs"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSignUpSubmit();
            }
          }}
        >
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            {signUpSuccsessful && (
              <Typography color="primary">Sign up succsessful</Typography>
            )}
            {emailExists && usernameExists && (
              <Typography color="secondary">
                Email and username already exist
              </Typography>
            )}
            {usernameExists && !emailExists && (
              <Typography color="secondary">
                This username already exists
              </Typography>
            )}
            {emailExists && !usernameExists && (
              <Typography color="secondary">
                This email already exists
              </Typography>
            )}
            <form className={classes.form} noValidate autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="fname"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    onChange={onChange}
                    value={fname}
                    error={fnameError == "" ? false : true}
                    helperText={fnameError == "" ? null : fnameError}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lname"
                    onChange={onChange}
                    value={lname}
                    error={lnameError == "" ? false : true}
                    helperText={lnameError == "" ? null : lnameError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    onChange={onChange}
                    value={username}
                    error={usernameError == "" ? false : true}
                    helperText={usernameError == "" ? null : usernameError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    onChange={onChange}
                    value={email}
                    error={emailError == "" ? false : true}
                    helperText={emailError == "" ? null : emailError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password1"
                    label="Password"
                    type="password"
                    id="password1"
                    onChange={onChange}
                    value={password1}
                    error={password1Error == "" ? false : true}
                    helperText={password1Error == "" ? null : password1Error}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password2"
                    label="Confirm Password"
                    type="password"
                    id="password2"
                    onChange={onChange}
                    value={password2}
                    error={password2Error == "" ? false : true}
                    helperText={password2Error == "" ? null : password2Error}
                  />
                </Grid>
                <Grid item container xs={12} spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" component="label" htmlFor="pp">
                      Profile picture
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <input
                      type="file"
                      name="pp"
                      id="pp"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      value={selectedPPpath}
                    ></input>
                  </Grid>
                </Grid>
              </Grid>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSignUpSubmit}
              >
                Sign Up
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link component={RouterLink} to="/signin" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      )}
    </Consumer>
  );
}
