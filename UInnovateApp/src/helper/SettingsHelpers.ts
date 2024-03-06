import { DataAccessor, Row } from "../virtualmodel/DataAccessor";
import vmd, { ConfigData, UserData } from "../virtualmodel/VMD";
import store from "../redux/Store";

/**
 * Saves a single, updated config value to the database
 * @param newConfig ConfigData
 * @returns boolean
 */
export async function saveConfigToDB(newConfig: ConfigData) {
  const data_accessor: DataAccessor = vmd.getUpsertDataAccessor(
    "meta",
    "appconfig_values",
    {
      columns: "property,table,column,value",
      on_conflict: "property,table,column",
    },
    newConfig as Row
  );

  data_accessor
    .upsert()
    .then(() => {
      //Displays a success notification
      const action = {
        type: "notification/displayNotification",
        payload: "Sucessfully updated the configuration.",
      };
      store.dispatch(action);

      console.log(
        "Sucessfully updated appconfig_values database table with new configuration."
      );
    })
    .catch((error) => {
      //Displays an error notification
      const action = {
        type: "notification/displayError",
        payload: "A problem occured while updating the configuration.",
      };
      store.dispatch(action);

      console.log(
        "ERROR: An error has occured when attempting to update the appconfig_values database table. Reason: "
      );
      console.log(error);
      return false;
    });

  return true;
}

export async function saveUserDataToDB(user: UserData) {
  const updateUserDataFA = vmd.getFunctionAccessor("meta", "update_user_data");
  updateUserDataFA.setBody({ user });
  updateUserDataFA
  .executeFunction()
  .then(() => {
    //Displays a success notification
    const action = {
      type: "notification/displayNotification",
      payload: "Sucessfully updated user data.",
    };
    store.dispatch(action);
  })
  .catch((error) => {
    //Displays an error notification
    const action = {
      type: "notification/displayError",
      payload: "A problem occured while updating the user data.",
    };
    store.dispatch(action);

    console.log(
      "ERROR: An error has occured when attempting to update the user data. Reason: "
    );
    console.log(error);
    return false;
  });

return true;
}
