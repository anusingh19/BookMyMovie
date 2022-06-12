import React, { Fragment, useState } from "react";
import {
  Button,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import Logo from "../../assets/logo.svg";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import TabPanel from "../tabPanel/TabPanel";
import "./Header.css";

const Header = ({ bookShow, bookShowId }) => {

  const [loginOpen, setLoginOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [login, setLogin] = useState(true);
  const [success, setSuccess] = useState(false);

  const onLogin = () => {
    setLoginOpen(true);
  };

  const onChange = (event, newValue) => {
    setValue(newValue);
  };

  const loginForm = () => {
    setLogin(false);
    setLoginOpen(false);
  };

  const registerForm = () => {
    setLogin(false);
    setSuccess(true);
  };

  return (
    <Fragment>
      <div className="header">
        <Link to="/">
          <img className="logo" src={Logo} alt="logo" />
        </Link>
        <div className="button-group">
          {login ? (
            <Button variant="contained" name="Login" onClick={onLogin}>
              Login
            </Button>
          ) : (
            <Button
              variant="contained"
              name="Logout"
              onClick={() => {
                setLogin(true);
              }}
            >
              Logout
            </Button>
          )}
          {bookShow ? (
            <Link
              to={"/book-show/" + bookShowId}
              style={{ textDecoration: "none" }}
            >
              <Button variant="contained" name="Book Show" color="primary">
                Book Show
              </Button>
            </Link>
          ) : null}
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
            left: "30%",
            right: "30%", 
            width: "30%",
            height: 'fit-content',
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
        <Tabs value={value} onChange={onChange}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <TextField label="Username" required />
          <br />
          <br />
          <TextField
            label="Password"
            required
            type="password"
            
          />
          <br />
          <br />
          <br />
          <br />
          <Button
            variant="contained"
            onClick={loginForm}
            color="primary"
          >
            Login
          </Button>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TextField
            label="First Name"
            required
          />
          <br />
          <br />
          <TextField label="Last Name" required />
          <br />
          <br />
          <TextField label="Email" required />
          <br />
          <br />
          <TextField
            required
            label="Password"
            type="password"
          />
          <br />
          <br />
          <TextField
            required
            label="Contact No."
          />
          <br />
          <br />
          {success ? (
            <Fragment>
              <Typography variant="subtitle1" gutterBottom>
                Registration Successful. Please login!
              </Typography>
              <br />
              <br />
            </Fragment>
          ) : null}
          
          <Button
            variant="contained"
            onClick={registerForm}
            color="primary"
          >
            Register
          </Button>
        </TabPanel>
      </Modal>
    </Fragment>
  );
};

export default Header;