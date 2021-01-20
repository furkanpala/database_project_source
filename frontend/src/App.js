import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import Home from "./components/Home";
import Create from "./components/Create";
import { Provider } from "./context";
import axios from "axios";
import NoticePage from "./components/NoticePage";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      username: "",
      email: "",
      phoneNumber: "",
      password1: "",
      password2: "",
      fnameError: "",
      lnameError: "",
      usernameError: "",
      emailError: "",
      phoneNumberError: "",
      password1Error: "",
      password2Error: "",
      usernameExists: false,
      emailExists: false,
      phoneNumberExists: false,
      currentUser: -1,
      wrongCredentials: false,
      signUpSuccsessful: false,
      isEditingProfile: false,
      userProfile: -1,
      selectedPP: null,
      selectedPPpath: "",
      title: "",
      noticeDescription: "",
      noticeType: false,
      place: "",
      colour: "",
      noticeFilePath: "",
      noticePictures: [],
      categories: [],
      selectedCategory: "Other",
      colourError: "",
      noticeDescriptionError: "",
      noticeTypeError: "",
      placeError: "",
      titleError: "",
      selectedCategories: [],
      sortBy: "date_created",
      howToSort: "DESC",
      notices: [],
      comment: "",
      comments: [],
    };
  }

  componentDidMount() {
    axios
      .get("/user")
      .then(({ data: { currentUser } }) => {
        this.setState({
          currentUser: currentUser,
        });
      })
      .catch(
        ({
          response: {
            data: { currentUser },
          },
        }) => {
          this.setState({
            currentUser: currentUser,
          });
        }
      );

    axios
      .get("/categories")
      .then(({ data: { categories } }) =>
        this.setState({ categories: categories })
      );

    this.handleNoticeFilter();
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    });
  };

  handleNoticeFilterChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    });
  };

  handleSwitchChange = ({ target: { name, checked } }) => {
    this.setState({
      [name]: checked,
    });
  };

  handleSignUpSubmit = () => {
    const formData = new FormData();
    formData.append("fname", this.state.fname);
    formData.append("lname", this.state.lname);
    formData.append("username", this.state.username);
    formData.append("email", this.state.email);
    formData.append("password1", this.state.password1);
    formData.append("password2", this.state.password2);
    if (this.state.selectedPP) formData.append("file", this.state.selectedPP);

    axios
      .post("/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        this.clearForms();
        this.setState({
          signUpSuccsessful: true,
        });
      })
      .catch(
        ({
          response: {
            data: {
              fnameError,
              lnameError,
              usernameError,
              emailError,
              password1Error,
              password2Error,
              usernameExists,
              emailExists,
            },
          },
        }) => {
          this.setState({
            fnameError: fnameError,
            lnameError: lnameError,
            usernameError: usernameError,
            emailError: emailError,
            password1Error: password1Error,
            password2Error: password2Error,
            usernameExists: usernameExists,
            emailExists: emailExists,
            signUpSuccsessful: false,
            selectedPP: null,
            selectedPPpath: "",
          });
        }
      );
  };

  handleLoginSubmit = () => {
    const user = {
      username: this.state.username,
      password: this.state.password1,
    };

    axios
      .post("/signin", user)
      .then(({ data: { currentUser, wrongCredentials } }) => {
        this.setState({
          username: "",
          password1: "",
          currentUser: currentUser,
          wrongCredentials: wrongCredentials,
        });
      })
      .catch(
        ({
          response: {
            data: { currentUser, wrongCredentials },
          },
        }) => {
          this.setState({
            currentUser: currentUser,
            wrongCredentials: wrongCredentials,
          });
        }
      );
  };

  handleLogout = () => {
    axios.post("/signout").then(({ data: { currentUser } }) => {
      this.setState({
        currentUser: currentUser,
      });
    });
  };

  fetchUser = (username) => {
    if (username === this.state.currentUser.username) {
      const pu = { ...this.state.currentUser };
      this.setState({
        userProfile: pu,
      });
    } else {
      axios
        .get("/user/" + username)
        .then(({ data: { user } }) =>
          this.setState({
            userProfile: user,
          })
        )
        .catch(({ response: { data: { user } } }) =>
          this.setState({
            userProfile: user,
          })
        );
    }
  };

  clearProfileUser = () => {
    this.setState({
      userProfile: -1,
    });
    this.clearForms();
  };

  clearForms = () => {
    this.setState({
      fname: "",
      lname: "",
      username: "",
      email: "",
      phoneNumber: "",
      password1: "",
      password2: "",
      fnameError: "",
      lnameError: "",
      usernameError: "",
      emailError: "",
      phoneNumberError: "",
      password1Error: "",
      password2Error: "",
      usernameExists: false,
      emailExists: false,
      phoneNumberExists: false,
      wrongCredentials: false,
      signUpSuccsessful: false,
      isEditingProfile: false,
      selectedPP: null,
      selectedPPpath: "",
      noticeFilePath: "",
      noticePictures: [],
      selectedCategory: "Other",
      colourError: "",
      noticeDescriptionError: "",
      noticeTypeError: "",
      placeError: "",
      titleError: "",
      title: "",
      noticeDescription: "",
      noticeType: false,
      place: "",
      colour: "",
    });
  };

  handleFileSelect = (e) => {
    this.setState({
      selectedPP: e.target.files[0],
      selectedPPpath: e.target.value,
    });
  };

  handleProfileEdit = () => {
    this.setState({
      username: this.state.currentUser.username,
      fname: this.state.currentUser.fname,
      lname: this.state.currentUser.lname,
      email: this.state.currentUser.email,
      phoneNumber: this.state.currentUser.phoneNumber,
      isEditingProfile: true,
    });
  };

  handleProfileEditSave = () => {
    const formData = new FormData();
    const {
      username,
      fname,
      lname,
      phoneNumber,
      selectedPP,
      email,
    } = this.state;

    formData.append("username", username);
    formData.append("fname", fname);
    formData.append("lname", lname);
    formData.append("phoneNumber", phoneNumber);
    formData.append("email", email);
    if (selectedPP) formData.append("file", selectedPP);

    axios
      .put("/user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(({ data: { currentUser } }) => {
        this.setState({ currentUser: currentUser, userProfile: currentUser });
        this.clearForms();
      })
      .catch(
        ({
          response: {
            data: {
              fnameError,
              lnameError,
              usernameError,
              emailError,
              phoneNumberError,
              usernameExists,
              emailExists,
              phoneNumberExists,
            },
          },
        }) => {
          this.clearForms();
          this.setState({
            fnameError: fnameError,
            lnameError: lnameError,
            usernameError: usernameError,
            emailError: emailError,
            phoneNumberError: phoneNumberError,
            usernameExists: usernameExists,
            emailExists: emailExists,
            phoneNumberExists: phoneNumberExists,
          });
        }
      );
  };

  handleCreate = () => {
    const formData = new FormData();
    const {
      title,
      place,
      colour,
      noticeType,
      noticeDescription,
      noticePictures,
      selectedCategory,
    } = this.state;

    formData.append("title", title);
    formData.append("place", place);
    formData.append("colour", colour);
    formData.append("item_notice_type", noticeType ? "1" : "0");
    formData.append("notice_description", noticeDescription);
    formData.append("fileAmount", String(noticePictures.length));
    formData.append("category_name", selectedCategory);
    for (let i = 0; i < noticePictures.length; i++)
      formData.append("file" + String(i), noticePictures[i]);

    axios
      .post("/notice", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(
        ({
          data: {
            colourError,
            noticeDescriptionError,
            noticeTypeError,
            placeError,
            titleError,
          },
        }) => {
          this.clearForms();
          this.setState({
            colourError: colourError,
            noticeDescriptionError: noticeDescriptionError,
            noticeTypeError: noticeTypeError,
            placeError: placeError,
            titleError: titleError,
          });
        }
      )
      .catch(
        ({
          response: {
            data: {
              colourError,
              noticeDescriptionError,
              noticeTypeError,
              placeError,
              titleError,
            },
          },
        }) => {
          this.clearForms();
          this.setState({
            colourError: colourError,
            noticeDescriptionError: noticeDescriptionError,
            noticeTypeError: noticeTypeError,
            placeError: placeError,
            titleError: titleError,
          });
        }
      );
  };

  handleNoticeFileSelect = (e) => {
    this.setState({
      noticePictures: e.target.files,
      noticeFilePath: e.target.value,
    });
  };

  handleToolBarCategorySelect = (e) => {
    if (e.target.checked)
      this.setState({
        selectedCategories: [...this.state.selectedCategories, e.target.value],
      });
    else
      this.setState({
        selectedCategories: this.state.selectedCategories.filter(
          (categoryName) => categoryName !== e.target.value
        ),
      });
  };

  handleNoticeFilter = () => {
    const data = {
      title: this.state.title,
      place: this.state.place,
      colour: this.state.colour,
      selectedCategories: this.state.selectedCategories,
      sortBy: this.state.sortBy,
      howToSort: this.state.howToSort,
    };
    axios.post("/notices", data).then(({ data: { notices } }) => {
      this.setState({
        notices: notices,
      });
    });
  };

  handleCommentSubmit = (id) => {
    axios
      .post("/comment", { comment: this.state.comment, notice_id: id })
      .then(() => {
        this.setState({ comment: "" });
        this.handleGetComments(id);
      });
  };

  handleGetComments = (id) => {
    console.log(id);
    axios
      .get("/comment/" + id)
      .then(({ data: { comments } }) => this.setState({ comments: comments }));
  };

  handleHelpfulButton = (id, notice_id) => {
    axios.get("/helpful/" + id).then(() => this.handleGetComments(notice_id));
  };
  handleNotHelpfulButton = (id, notice_id) => {
    axios
      .get("/not_helpful/" + id)
      .then(() => this.handleGetComments(notice_id));
  };

  render() {
    return (
      <>
        {this.state.currentUser === -1 ? null : (
          <BrowserRouter>
            <Provider
              value={{
                ...this.state,
                onChange: this.handleChange,
                handleSignUpSubmit: this.handleSignUpSubmit,
                handleLoginSubmit: this.handleLoginSubmit,
                handleLogout: this.handleLogout,
                handleFileSelect: this.handleFileSelect,
                handleProfileEdit: this.handleProfileEdit,
                handleProfileEditSave: this.handleProfileEditSave,
                onSwitchChange: this.handleSwitchChange,
                handleCreate: this.handleCreate,
                handleNoticeFileSelect: this.handleNoticeFileSelect,
                handleToolBarCategorySelect: this.handleToolBarCategorySelect,
                handleNoticeFilterChange: this.handleNoticeFilterChange,
                handleNoticeFilter: this.handleNoticeFilter,
                handleCommentSubmit: this.handleCommentSubmit,
                handleHelpfulButton: this.handleHelpfulButton,
                handleNotHelpfulButton: this.handleNotHelpfulButton,
              }}
            >
              <Header />
              <Switch>
                <>
                  <Route exact={true} path="/" component={Home} />
                  <Route
                    exact={true}
                    path={"/profile/:username"}
                    render={(props) => (
                      <>
                        {this.state.currentUser === null ? (
                          <Redirect to="/signin" {...props} />
                        ) : (
                          <Profile
                            {...props}
                            onMount={this.fetchUser}
                            onUnmount={this.clearProfileUser}
                          />
                        )}
                      </>
                    )}
                  ></Route>
                  <Route
                    exact={true}
                    path={"/notice/:id"}
                    render={(props) => (
                      <NoticePage
                        {...props}
                        onMount={this.handleGetComments}
                      ></NoticePage>
                    )}
                  ></Route>
                  <Route
                    exact={true}
                    path="/create"
                    render={(props) => (
                      <>
                        {this.state.currentUser === null ? (
                          <Redirect to="signin" {...props} />
                        ) : (
                          <Create {...props} />
                        )}
                      </>
                    )}
                  ></Route>
                  <Route
                    exact={true}
                    path="/signin"
                    render={(props) => (
                      <>
                        {this.state.currentUser ? (
                          <Redirect to="/" {...props} />
                        ) : (
                          <SignIn {...props} onUnmount={this.clearForms} />
                        )}
                      </>
                    )}
                  ></Route>
                  <Route
                    exact={true}
                    path="/signup"
                    render={(props) => (
                      <>
                        {this.state.currentUser ? (
                          <Redirect to="/" {...props} />
                        ) : (
                          <SignUp {...props} onUnmount={this.clearForms} />
                        )}
                      </>
                    )}
                  ></Route>
                </>
                )
              </Switch>
            </Provider>
          </BrowserRouter>
        )}
        )
      </>
    );
  }
}

export default App;
