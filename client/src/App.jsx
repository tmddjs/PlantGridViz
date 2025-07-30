import { Route, Switch } from "wouter";
import PlantGrid from "./components/PlantGrid.jsx";
import NotFound from "./pages/not-found.jsx";

function App() {
  return (
    <Switch>
      <Route path="/" component={PlantGrid} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;