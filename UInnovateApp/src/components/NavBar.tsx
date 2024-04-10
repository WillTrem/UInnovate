import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { BsFillWrenchAdjustableCircleFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import SignupModal from "./settingsPage/SignupModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { AuthState, LOGIN_BYPASS, Role, logOut } from "../redux/AuthSlice";
import { Tooltip, Zoom } from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { setLoading } from "../redux/LoadingSlice";
import vmd from "../virtualmodel/VMD";
import MenuSchemaSelector from "./Schema/MenuSchemaSelector";
import nav_logo from "../../public/PostGOAT_nav.png";
import LanguageSelector from "./LanguageSelector";
import { I18n } from "../helper/i18nHelpers";
import {
  getLanguagesProps,
  i18nTranslationsProps,
} from "../virtualmodel/I18nDataAccessor";
import {
  translation,
  updateTranslation,
} from "../redux/LanguageSelectionSlice";

interface NavBarProps {
  showSchemaFilter?: boolean;
}
export function NavBar({ showSchemaFilter = true }: NavBarProps) {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const { user: loggedInUser, dbRole }: AuthState = useSelector(
    (state: RootState) => state.auth,
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClose = () => setShowSignupModal(false);
  const handleShow = () => setShowSignupModal(true);
  const handleLogout = () => {
    dispatch(setLoading(true));
    dispatch(logOut());
    vmd.refetchSchemas().then(() => {
      dispatch(setLoading(false));
    });
    navigate("/");
  };

  //labels
  const selectedLanguage: string = useSelector(
    (state: RootState) => state.languageSelection.lang,
  );

  const translations = useSelector(
    (state: RootState) => state.languageSelection.translations,
  );

  const [i18n, setI18n] = useState(new I18n([], selectedLanguage));

  const [settings_lbl, setSettings_lbl] = useState("");

  useEffect(() => {
    console.log("use effect translations", translations);
    if (translations[0].values.length == 0) {
      var res = getLanguagesProps()
        .then((langs) => {
          var res = langs?.map(async (lang) => {
            return await I18n.reloadI18Values(lang.language_code).then(
              (data) => {
                return data;
              },
            );
          });
          if (res) return Promise.all(res);
          return [];
        })
        .then((data) => {
          let translations: translation[] = [];
          data.map((translationProp) => {
            const transl: translation = {
              languageCode: translationProp[0].language_code,
              values: translationProp,
            };
            translations = [...translations, transl];
          });
          return translations;
        });
      res
        .then((data) => {
          // state.translations = data;
          console.log(data);
          dispatch(updateTranslation(data));
          i18n.setTranslationList(data);
          i18n.setLanguage(selectedLanguage);
        })
        .then(() => {
          updateLabels();
        });
    } else {
      console.log(translations);
      i18n.setTranslationList(translations);
      i18n.setLanguage(selectedLanguage).then(() => {
        updateLabels();
      });
    }
    console.log("selectedLanguage: ", selectedLanguage);
  }, []);

  useEffect(() => {
    // console.log(selectedLanguage);
    console.log("updating labels for lang", selectedLanguage);
    i18n.setLanguage(selectedLanguage).then(() => updateLabels());
  }, [selectedLanguage]);

  const updateLabels = () => {
    setSettings_lbl(i18n.get("settings", "Settings"));
  };

  return (
    <Navbar
      bg="dark"
      data-bs-theme="dark"
      expand="lg"
      className="bg-body-tertiary"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          style={{ fontSize: "30px", margin: "0px 10px 5px 0px" }}
        >
          <img src={nav_logo} alt="PostGOAT" style={{ height: "50px" }} />
        </Navbar.Brand>
        <Navbar.Brand as={Link} to="/" style={{ fontSize: "30px" }}>
          PostGOAT
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          {(LOGIN_BYPASS || loggedInUser) && (
            <Nav
              className={
                showSchemaFilter ? "justify-content flex-grow-1 pe-3" : "d-none"
              }
            >
              <MenuSchemaSelector />
            </Nav>
          )}
          <Nav className="justify-content-end flex-grow-1 pe-3">
            {(LOGIN_BYPASS || loggedInUser) && (
              <>
                {/* Hides the Settings page link for user role */}
                <Nav.Link
                  as={Link}
                  to="/settings"
                  style={{ fontSize: "25px" }}
                  hidden={dbRole === Role.USER}
                >
                  {settings_lbl}
                </Nav.Link>
              </>
            )}
            {loggedInUser && (
              <Nav.Link>
                <Tooltip
                  title={`Welcome, ${loggedInUser}`}
                  arrow
                  placement="bottom"
                  TransitionComponent={Zoom}
                >
                  <AccountCircleIcon sx={{ fontSize: 40 }} />
                </Tooltip>
              </Nav.Link>
            )}
            {loggedInUser ? (
              <Nav.Link
                onClick={handleLogout}
                style={{
                  fontSize: "25px",
                  display: "flex",
                  alignItems: "center",
                }}
                data-testid="logout-button"
              >
                {/* Log out */}
                <LogoutIcon fontSize="large" />
              </Nav.Link>
            ) : (
              <Nav.Link
                onClick={handleShow}
                style={{
                  fontSize: "25px",
                  display: "flex",
                  alignItems: "center",
                }}
                data-testid="signup-button"
              >
                {/* Sign Up */}
                <LoginIcon fontSize="large" />
              </Nav.Link>
            )}
            <LanguageSelector />
          </Nav>
        </Navbar.Collapse>
      </Container>
      <SignupModal open={showSignupModal} onClose={handleClose} />
    </Navbar>
  );
}
