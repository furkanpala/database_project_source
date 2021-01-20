import { Button, Container, TextField, Typography } from "@material-ui/core";
import React from "react";
import { Consumer } from "../context";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(4),
  },
  forms: {
    paddingTop: theme.spacing(2),
  },
}));

export default function Create() {
  const classes = useStyles();
  return (
    <Consumer>
      {({
        currentUser,
        title,
        place,
        colour,
        noticeDescription,
        noticeType,
        onSwitchChange,
        onChange,
        handleCreate,
        handleNoticeFileSelect,
        noticeFilePath,
        categories,
        selectedCategory,
        colourError,
        noticeDescriptionError,
        noticeTypeError,
        placeError,
        titleError,
      }) => (
        <>
          {currentUser === null || currentUser === -1 ? null : (
            <Container maxWidth="xs">
              <div className={classes.container}>
                <Typography component="h1" variant="h4">
                  Create New Notice
                </Typography>
                {colourError ? (
                  <Typography color="secondary">{colourError}</Typography>
                ) : null}
                {noticeDescriptionError ? (
                  <Typography color="secondary">
                    {noticeDescriptionError}
                  </Typography>
                ) : null}
                {noticeTypeError ? (
                  <Typography color="secondary">{noticeTypeError}</Typography>
                ) : null}
                {placeError ? (
                  <Typography color="secondary">{placeError}</Typography>
                ) : null}
                {titleError ? (
                  <Typography color="secondary">{titleError}</Typography>
                ) : null}
                <Typography component="div">
                  <Grid
                    component="label"
                    container
                    alignItems="center"
                    spacing={1}
                  >
                    <Grid item>Found</Grid>
                    <Grid item>
                      <Switch
                        checked={noticeType}
                        onChange={onSwitchChange}
                        color="primary"
                        name="noticeType"
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                    </Grid>
                    <Grid item>Searching</Grid>
                  </Grid>
                </Typography>
                <Grid container spacing={2} className={classes.forms}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      name="title"
                      label="Title"
                      fullWidth
                      required
                      value={title}
                      onChange={onChange}
                    ></TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      name="colour"
                      label="Colour"
                      fullWidth
                      value={colour}
                      onChange={onChange}
                    ></TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      name="place"
                      label="Place"
                      fullWidth
                      value={place}
                      onChange={onChange}
                    ></TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      name="noticeDescription"
                      label="Description"
                      fullWidth
                      multiline
                      rows={4}
                      value={noticeDescription}
                      onChange={onChange}
                    ></TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="noticePictures"
                    >
                      Add pictures
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <input
                      type="file"
                      name="noticePictures"
                      id="noticePictures"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleNoticeFileSelect}
                      value={noticeFilePath}
                      multiple
                    ></input>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel required id="category">
                        Choose a category
                      </InputLabel>
                      <Select
                        labelId="category"
                        id="category"
                        value={selectedCategory}
                        onChange={onChange}
                        label="Choose a category"
                        fullWidth
                        name="selectedCategory"
                        required
                      >
                        {categories.map((value, index) => (
                          <MenuItem value={value.category_name} key={index}>
                            {value.category_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      color="primary"
                      variant="contained"
                      fullWidth
                      onClick={handleCreate}
                    >
                      CREATE
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Container>
          )}
        </>
      )}
    </Consumer>
  );
}
