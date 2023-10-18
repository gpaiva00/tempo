import { Routes as ReactRouterDomRoutes, Route, BrowserRouter as Router } from 'react-router-dom'

import AddForecast from '../src/pages/AddForecast/AddForecast'
import Forecasts from '../src/pages/Forecasts/Forecasts'

function App() {
  return (
    <Router>
      <ReactRouterDomRoutes>
        <Route
          path="/"
          element={<Forecasts />}
        />
        <Route
          path="/add-forecast"
          element={<AddForecast />}
        />
      </ReactRouterDomRoutes>
    </Router>
  )
}

export default App
