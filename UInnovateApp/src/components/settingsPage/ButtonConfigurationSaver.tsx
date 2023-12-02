import { ConfigType, useConfig } from "../../contexts/ConfigContext";
import { useEffect, useRef } from "react";
import { updateAppConfigValues } from "../../virtualmodel/Config";
import { Button } from "@mui/material";

const primaryButtonStyle = {
  marginTop: 20,
  width: "fit-content",
};

// Button component in charge of saving the configuration at regular intervals and on leave
const ButtonConfigurationSaver: React.FC = () => {
  const { config } = useConfig();
  const configRef = useRef<ConfigType>(config);

  // Keeps configRef up to date with the most recent config value
  useEffect(() => {
    console.log("ConfigRef updated");
    configRef.current = config;
  }, [config]);

  // On click, saves the configuration to the DB
  function handleClick() {
    updateAppConfigValues(configRef.current);
    console.log("Saving the configuration in the DB via button.");
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
