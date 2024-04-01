import { render, screen, act } from "@testing-library/react";
import { Provider } from "react-redux";
import AdditionalViewNavBar from "../components/AdditionalViewNavBar";
import { cleanup } from "@testing-library/react";
import store from "../redux/Store";
import { Router } from "react-router-dom";

describe("AdditionalViewNavBar component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders without crashing", () => {
    render(
      <Provider store={store}>
        <Router location={""} navigator={undefined}>
          <AdditionalViewNavBar
            selectedSchema="schema"
            selectedView="view"
            selectViewHandler={() => {}}
          />
        </Router>
      </Provider>,
    );
  });
});
