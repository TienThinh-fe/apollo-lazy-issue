import FilterComponent from './FilterComponent.jsx'
import { FilterProvider } from './context/FilterContext.jsx'
import './App.css'

function App() {
  return (
    <FilterProvider>
      <FilterComponent />
    </FilterProvider>
  )
}

export default App
