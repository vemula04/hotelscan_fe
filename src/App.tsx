import { MainLayout } from "./components/layouts/Main/MainLayout";
import "./App.scss";
import { HashRouter } from "react-router-dom";
import { FormDataProvider } from "./components/Items/stateManagement/FormDataContext";
import { ConfigProvider } from "./config/config";
function App() {
  return (
    <HashRouter>
       <ConfigProvider>
      <FormDataProvider>
    <div className="App" data-test-id="app-component">
      <MainLayout />
    </div>
    </FormDataProvider>
    </ConfigProvider>
    </HashRouter>
  );
}

export default App;