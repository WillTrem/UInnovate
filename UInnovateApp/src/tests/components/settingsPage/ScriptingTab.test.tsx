import { render, screen, waitFor, act } from "@testing-library/react";
import { describe, expect } from "vitest";
import { ScriptingTab } from "../../../components/settingsPage/ScriptingTab";
import { Provider } from "react-redux";
import store from "../../../redux/Store";

vi.unmock("../../virtualmodel/VMD");
vi.unmock("../../../virtualmodel/DataAccessor");

describe("ScriptingTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // it("should render the ScriptingTab and script editor", async () => {
  //   render(
  //     <Provider store={store}>
  //       <ScriptingTab />
  //     </Provider>
  //   );

  //   await waitFor(() => {
  //     expect(screen.getByText("Scripts")).toBeInTheDocument();
  //   });
  // });

  it("should display the scripts", async () => {
    render(
      <Provider store={store}>
        <ScriptingTab />
      </Provider>
    );

    console.log(screen.debug(undefined, 20000));
    

    await waitFor(() => {
      expect(screen.getByText("mock name")).toBeInTheDocument();
      expect(screen.getByText("mock name 2")).toBeInTheDocument();
      expect(screen.getByText("mock name 3")).toBeInTheDocument();
    });
  });

  // it("the button should open the modal", async () => {
  //   render(
  //     <Provider store={store}>
  //       <ScriptingTab />
  //     </Provider>
  //   );

  //   const button = screen.getByRole("button");

  //   act(() => {
  //     button.click();
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText("Add New Script")).toBeInTheDocument();
  //   });
  // });

  // it("the modal should have a form with the column names", async () => {
  //   render(
  //     <Provider store={store}>
  //       <ScriptingTab />
  //     </Provider>
  //   );

  //   const button = screen.getByRole("button");

  //   act(() => {
  //     button.click();
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText("Add New Script")).toBeInTheDocument();
  //     expect(screen.getByText("Column1")).toBeInTheDocument();
  //     expect(screen.getByText("Column2")).toBeInTheDocument();
  //     expect(screen.getByText("Column3")).toBeInTheDocument();
  //     expect(screen.getByText("Close")).toBeInTheDocument();
  //     expect(screen.getByText("Add Script")).toBeInTheDocument();
  //   });
  // });
});
