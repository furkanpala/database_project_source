import TextField from "@material-ui/core/TextField";
import { Button, makeStyles } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Consumer } from "../context";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
  },
  innerContainer: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  sortBy: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  radioButtons: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
}));

export default function ToolBar() {
  const classes = useStyles();
  return (
    <Consumer>
      {({
        categories,
        handleToolBarCategorySelect,
        title,
        colour,
        place,
        sortBy,
        howToSort,
        handleNoticeFilterChange,
        handleNoticeFilter,
      }) => (
        <div className={classes.container}>
          <div className={classes.innerContainer}>
            <TextField
              variant="outlined"
              label="Title"
              name="title"
              size="small"
              value={title}
              onChange={handleNoticeFilterChange}
            />
            <TextField
              variant="outlined"
              label="Colour"
              name="colour"
              size="small"
              value={colour}
              onChange={handleNoticeFilterChange}
            />
            <TextField
              variant="outlined"
              label="Place"
              name="place"
              size="small"
              value={place}
              onChange={handleNoticeFilterChange}
            />
          </div>
          <div className={classes.innerContainer}>
            {categories.map((category) => (
              <FormControlLabel
                key={category.category_name}
                control={
                  <Checkbox
                    onChange={handleToolBarCategorySelect}
                    name={category.category_name}
                    color="primary"
                    value={category.category_name}
                  />
                }
                label={category.category_name}
              />
            ))}
          </div>
          <FormControl component="fieldset" className={classes.sortBy}>
            <FormLabel component="legend">Sort by</FormLabel>
            <RadioGroup
              name="sortBy"
              value={sortBy}
              onChange={handleNoticeFilterChange}
              className={classes.radioButtons}
            >
              <FormControlLabel
                value="date_created"
                control={<Radio />}
                label="Date"
              />
              <FormControlLabel
                value="title"
                control={<Radio />}
                label="Title"
              />
              <FormControlLabel
                value="place"
                control={<Radio />}
                label="Place"
              />
              <FormControlLabel
                value="colour"
                control={<Radio />}
                label="Colour"
              />
            </RadioGroup>
          </FormControl>
          <FormControl component="fieldset" className={classes.sortBy}>
            <RadioGroup
              name="howToSort"
              value={howToSort}
              onChange={handleNoticeFilterChange}
              className={classes.radioButtons}
            >
              <FormControlLabel
                value="DESC"
                control={<Radio />}
                label="Descending"
              />
              <FormControlLabel
                value="ASC"
                control={<Radio />}
                label="Ascending"
              />
            </RadioGroup>
          </FormControl>
          <Button variant="contained" onClick={handleNoticeFilter}>
            Filter
          </Button>
        </div>
      )}
    </Consumer>
  );
}
