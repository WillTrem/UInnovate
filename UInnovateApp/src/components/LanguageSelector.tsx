import { useEffect, useState } from "react";
import { getLanguagesCodes } from "../virtualmodel/I18nDataAccessor";
import { Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { updateLang } from "../redux/LanguageSelectionSlice";

const LanguageSelector = () => {
  const selectedLanguage: string = useSelector(
    (state: RootState) => state.languageSelection.lang,
  );
  const dispatch = useDispatch();

  const [currentLanguage, setCurrentLanguage] =
    useState<string>(selectedLanguage);
  const [languages, setLanguages] = useState<string[]>([]);

  useEffect(() => {
    getLanguagesCodes().then((langs) => {
      setLanguages(langs || []);
    });
  }, []);
  return (
    <>
      {languages.map((lang) => (
        <Nav.Item key={lang}>
          <Nav.Link
            active={lang == currentLanguage}
            eventKey={lang}
            onClick={() => {
              setCurrentLanguage(lang);
              dispatch(updateLang(lang));
            }}
            style={{
              fontSize: "25px",
              display: "flex",
              alignItems: "center",
              borderBlockColor: "red",
              marginRight: "5px",
            }}
          >
            {lang}
          </Nav.Link>
        </Nav.Item>
      ))}
    </>
  );
};

export default LanguageSelector;
