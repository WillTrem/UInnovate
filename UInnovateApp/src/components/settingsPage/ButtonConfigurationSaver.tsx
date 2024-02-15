import { ConfigType, useConfig } from "../../contexts/ConfigContext";
import { useEffect, useRef } from "react";
import { updateAppConfigValues } from "../../virtualmodel/Config";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { saveUserDataToDB } from "../../redux/UserDataSlice";

const primaryButtonStyle = {
  marginTop: 20,
  width: "fit-content",
};

// Button component in charge of saving the configuration at regular intervals and on leave
const ButtonConfigurationSaver: React.FC = () => {
  const { config } = useConfig();
  const configRef = useRef<ConfigType>(config);
  const dispatch = useDispatch();

  // Keeps configRef up to date with the most recent config value
  useEffect(() => {
    console.log("ConfigRef updated");
    configRef.current = config;
  }, [config]);

  // On click, saves the configuration to the DB
  function handleClick() {
    updateAppConfigValues(configRef.current);
    dispatch(saveUserDataToDB());
    console.log("Saving the configuration in the DB via button.");
    window.location.reload(); 
  }

  return (
    <>
      <Button
        variant="contained"
        style={primaryButtonStyle}
        onClick={handleClick}
      >
        save
      </Button>
    </>
  );
};

export default ButtonConfigurationSaver;
