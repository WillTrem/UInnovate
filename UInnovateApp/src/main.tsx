import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Store from "./redux/Store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={Store}>
      <App />
    </Provider>
  </BrowserRouter>
);
