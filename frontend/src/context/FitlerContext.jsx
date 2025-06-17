import { createContext, useContext, useReducer } from 'react'

// Action types
const FILTER_ACTIONS = {
  SET_TAGS: 'SET_TAGS',
  SET_PERSONS: 'SET_PERSONS',
  SET_LOCATIONS: 'SET_LOCATIONS',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ALL: 'CLEAR_ALL',
}

// Initial state
const initialState = {
  tagsData: [],
  personsData: [],
  locationsData: [],
  loadingMap: {
    tags: false,
    persons: false,
    locations: false,
  },
}

// Reducer function
const filterReducer = (state, action) => {
  switch (action.type) {
    case FILTER_ACTIONS.SET_TAGS:
      return {
        ...state,
        tagsData: action.payload,
      }
    case FILTER_ACTIONS.SET_PERSONS:
      return {
        ...state,
        personsData: action.payload,
      }
    case FILTER_ACTIONS.SET_LOCATIONS:
      return {
        ...state,
        locationsData: action.payload,
      }
    case FILTER_ACTIONS.SET_LOADING:
      return {
        ...state,
        loadingMap: {
          ...state.loadingMap,
          [action.filterType]: action.payload,
        },
      }
    case FILTER_ACTIONS.CLEAR_ALL:
      return initialState
    default:
      return state
  }
}

// Create context
const FilterContext = createContext()

// Provider component
export const FilterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(filterReducer, initialState)

  const actions = {
    setTagsData: (data) =>
      dispatch({ type: FILTER_ACTIONS.SET_TAGS, payload: data }),
    setPersonsData: (data) =>
      dispatch({ type: FILTER_ACTIONS.SET_PERSONS, payload: data }),
    setLocationsData: (data) =>
      dispatch({ type: FILTER_ACTIONS.SET_LOCATIONS, payload: data }),
    setLoading: (filterType, loading) =>
      dispatch({
        type: FILTER_ACTIONS.SET_LOADING,
        filterType,
        payload: loading,
      }),
    clearAll: () => dispatch({ type: FILTER_ACTIONS.CLEAR_ALL }),
  }

  return (
    <FilterContext.Provider value={{ state, actions }}>
      {children}
    </FilterContext.Provider>
  )
}

// Custom hook to use filter context
export const useFilterContext = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider')
  }
  return context
}

export { FILTER_ACTIONS }
