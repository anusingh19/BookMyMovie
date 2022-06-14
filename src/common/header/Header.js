import React, { Fragment, useState } from "react";
import {
  Button,
  FormControl,
  Input,
  InputLabel,
  Tab,
  Tabs,
  TextField,
  Typography,
  createTheme,
} from "@material-ui/core";
import Logo from "../../assets/logo.svg";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import TabPanel from "../tabPanel/TabPanel";
import "./Header.css";
import { makeStyles } from '@material-ui/core/styles';

const Header = ({ bookShow, bookShowId }) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexDirection: "column",
      alignContent: "nowrap",
      justifyContent: "center",
    },
    formControl: {
      marginLeft: theme.spacing(8),
      marginRight: theme.spacing(8),
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      minWidth: 120,
    },
    button: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(8),
      marginRight: theme.spacing(8),
    },
  }));

  const classes = useStyles();

  const [loginOpen, setLoginOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [success, setSuccess] = useState(false);

  const [loginValues, setLoginValues] = useState({
    username: "",
    password: "",
  });

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contactNo: "",
    firstNameError: false,
    lastNameError: false,
    emailError: false,
    passwordError: false,
    contactNoError: false,
    registered: false,
  });

  const onLogin = () => {
    setLoginOpen(true);
  };

  const handleModalChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLoginChange = (prop) => (event) => {
    setLoginValues({ ...loginValues, [prop]: event.target.value });
  };

  const handleChange = (prop) => (event) => {

    console.log(prop);
    console.log(event.target.value);
    setValues({
      ...values,
      registered: false,
      [prop]: event.target.value,
      [prop + "Error"]:
        event.target.value === undefined ||
          event.target.value.trim() === ""
          ? true
          : false,
    });
  };

  const handleLoginSubmit = (event) => {
    setLoginOpen(false);
    setLoggedIn(true);
    // const tryLogin = async () => {
    //   try {
    //     let myHeaders = new Headers();

    //     myHeaders.append("access-control-allow-origin", "*");
    //     myHeaders.append("Content-Type", "application/json");
    //     myHeaders.append("Cache-Control", "no-cache");
    //     myHeaders.append(
    //       "Authorization",
    //       "Basic " +
    //       window.btoa(loginValues.username + ":" + loginValues.password)
    //     );

    //     let response = await fetch(
    //       'http://localhost:8085/api/v1/auth/login',
    //       {
    //         method: "POST",
    //         headers: myHeaders,
    //       }
    //     );
    //     if (response.ok && loggedIn !== true) {
    //       setLoginOpen(false);
    //       setLoggedIn(true);
    //     }
    //   } catch (e) { console.log(e) }
    // };
    // tryLogin();
  };

  const handleSubmit = (event) => {
    const tryRegister = async () => {
      setValues({
        ...values,
        registered: false,
      });

      try {
        const params = {
          email_address: values.email,
          first_name: values.firstName,
          last_name: values.lastName,
          mobile_number: values.contactNo,
          password: values.password,
        };
        let response = await fetch(
          'http://localhost:8085/api/v1/signup',
          {
            "access-control-allow-origin": "*",
            method: "POST",
            headers: {
              Accept: "application/json;charset=UTF-8",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(params)
          }
        );
        if (response.ok) {
          setValues({
            ...values,
            registered: true,
          });
          // setLoginOpen(false);
        }
      } catch (e) { }
    };
    tryRegister();
  };

  return (
    <Fragment>
      <div className="header">
        <Link to="/">
          <img className="logo" src={Logo} alt="logo" />
        </Link>
        <div className="button-group">
          {bookShow ?
            loggedIn ? (
              <Link
                to={"/bookshow/" + bookShowId}
                style={{ textDecoration: "none" }}
              >
                <Button variant="contained" name="Book Show" color="primary">
                  Book Show
                </Button>
              </Link>
            ) : (
              <Button variant="contained" name="Book Show" color="primary" onClick={onLogin}>
                Book Show
              </Button>
            ) : null}
          {!loggedIn ? (
            <Button variant="contained" name="Login" onClick={onLogin}>
              Login
            </Button>
          ) : (
            <Button
              variant="contained"
              name="Logout"
              onClick={() => {
                setLoggedIn(false);
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
      <Modal
        isOpen={loginOpen}
        ariaHideApp={false}
        style={{
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.75)",
          },
          content: {
            position: "absolute",
            top: "20%",
            left: "40%",
            right: "40%",
            height: 'fit-content',
            width: 'min-content',
            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
            outline: "none",
            padding: "20px",
          },
        }}
      >
        <Tabs
          value={value}
          indicatorColor="secondary"
          onChange={handleModalChange}
          aria-label="Login or Register">
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        <div className={classes.root}>
          <TabPanel value={value} index={0}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="username">Username *</InputLabel>
              <Input
                id="username"
                value={loginValues.username}
                onChange={handleLoginChange("username")}
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="password">Password *</InputLabel>
              <Input
                id="password"
                value={loginValues.password}
                type="password"
                onChange={handleLoginChange("password")}
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleLoginSubmit}
              >
                Login
              </Button>
            </FormControl>
          </TabPanel>
        </div>
        <TabPanel value={value} index={1}>
          <div className={classes.root}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="firstName">First Name *</InputLabel>
              <Input
                id="firstName"
                value={values.firstName}
                onChange={handleChange("firstName")}
              />
              <div style={{ color: "red", fontSize: "0.75rem" }}>
                {values.firstNameError ? "required" : ""}
              </div>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="lastName">Last Name *</InputLabel>
              <Input
                id="lastName"
                required
                value={values.lastName}
                onChange={handleChange("lastName")}
              />
              <div style={{ color: "red", fontSize: "0.75rem" }}>
                {values.lastNameError ? "required" : ""}
              </div>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="email">Email *</InputLabel>
              <Input
                id="email"
                value={values.email}
                onChange={handleChange("email")}
              />
              <div style={{ color: "red", fontSize: "0.75rem" }}>
                {values.emailError ? "required" : ""}
              </div>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="password">Password *</InputLabel>
              <Input
                id="password"
                required
                value={values.password}
                type="password"
                onChange={handleChange("password")}
              />
              <div style={{ color: "red", fontSize: "0.75rem" }}>
                {values.passwordError ? "required" : ""}
              </div>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="contactNo">Contact No *</InputLabel>
              <Input
                id="contactNo"
                value={values.contactNo}
                onChange={handleChange("contactNo")}
              />
              <div style={{ color: "red", fontSize: "0.75rem" }}>
                {values.contactNoError ? "required" : ""}
              </div>
            </FormControl>
            <FormControl className={classes.formControl}>
              <Typography>
                {values.registered
                  ? "Registration Successful. Please Login!"
                  : ""}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleSubmit}
              >
                Register
              </Button>
            </FormControl>
          </div>
        </TabPanel>
      </Modal>
    </Fragment >
  );
};

export default Header;