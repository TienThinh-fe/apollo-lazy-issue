import { gql, useLazyQuery } from '@apollo/client'
import { useFilterContext } from './context/FilterContext.jsx'

const GET_FILTER_OPTIONS = gql`
  query GetFilterOptions($type: String!) {
    getFilterOptions(type: $type) {
      id
      name
      type
    }
  }
`

const FilterComponent = () => {
  const { state, actions } = useFilterContext()
  const { tagsData, personsData, locationsData, loadingMap } = state

  const [getFilterOptions, { error }] = useLazyQuery(GET_FILTER_OPTIONS, {
    onError: (error) => {
      console.error('❌ Query error:', error)
    },
  })

  // Similar to loadFilterType in the provided component
  const loadFilterType = async (filterType) => {
    console.log(`🚀 Loading filter type: ${filterType}`)

    // Set loading state
    actions.setLoading(filterType, true)

    try {
      const { data } = await getFilterOptions({
        variables: { type: filterType },
      })

      console.log('✅ Query completed:', data)
      const items = data.getFilterOptions

      if (items.length > 0) {
        switch (filterType) {
          case 'tags':
            actions.setTagsData(items)
            break
          case 'persons':
            actions.setPersonsData(items)
            break
          case 'locations':
            actions.setLocationsData(items)
            break
        }
      }
    } catch (error) {
      console.error('❌ Error loading filter type:', error)
    } finally {
      // Clear loading state
      actions.setLoading(filterType, false)
    }
  }

  const handleButtonClick = (type) => {
    loadFilterType(type)
  }

  const renderList = (data, title, filterType) => (
    <div style={{ marginBottom: '20px' }}>
      <h3>{title}</h3>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          minHeight: '150px',
        }}
      >
        {loadingMap[filterType] ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100px',
              color: '#666',
              fontStyle: 'italic',
            }}
          >
            Loading {title.toLowerCase()}...
          </div>
        ) : data.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No data loaded</p>
        ) : (
          <ul>
            {data.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Apollo Client Lazy Query Cache Issue Demo (Global State)</h1>

      <div style={{ marginBottom: '30px' }}>
        <p>
          <strong>Instructions:</strong>
        </p>
        <ol>
          <li>Click "Load Tags" button and observe the loading state</li>
          <li>
            Immediately click "Load Persons" button (before Tags finish loading)
          </li>
          <li>
            Notice that only Persons data loads - Tags data is lost due to cache
            override
          </li>
          <li>
            Click "Load Tags" again to see it needs to make another request
          </li>
          <li>Use "Clear All Data" to reset the global state</li>
        </ol>
        <p>
          <strong>Note:</strong> This demo uses async/await pattern with loading
          states (similar to real-world filter components) and React Context for
          global state management, demonstrating how the Apollo Client cache
          issue affects practical implementations.
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => handleButtonClick('tags')}
          style={{
            marginRight: '10px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Load Tags
        </button>

        <button
          onClick={() => handleButtonClick('persons')}
          style={{
            marginRight: '10px',
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Load Persons
        </button>

        <button
          onClick={() => handleButtonClick('locations')}
          style={{
            marginRight: '10px',
            padding: '10px 20px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Load Locations
        </button>

        <button
          onClick={() => actions.clearAll()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Clear All Data
        </button>
      </div>

      {error && (
        <div
          style={{
            color: 'red',
            backgroundColor: '#ffebee',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          Error: {error.message}
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>{renderList(tagsData, 'Tags', 'tags')}</div>
        <div style={{ flex: 1 }}>
          {renderList(personsData, 'Persons', 'persons')}
        </div>
        <div style={{ flex: 1 }}>
          {renderList(locationsData, 'Locations', 'locations')}
        </div>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          borderRadius: '4px',
        }}
      >
        <h4>Expected Issue:</h4>
        <p>
          When you click the first button and then quickly click the second
          button before the first request completes, the Apollo Client cache
          will only store the result of the last (second) request. The first
          request's result will be lost from both the Apollo cache and the
          global state, and you'll need to click the first button again to
          reload that data.
        </p>
        <p>
          <strong>Real-world Impact:</strong> This pattern mimics how filter
          components work in production apps - using async/await with loading
          states and global state management. The cache issue can cause data
          loss when users interact quickly with different filter options.
        </p>
        <p>
          <strong>Open the browser console to see the request logs.</strong>
        </p>
      </div>
    </div>
  )
}

export default FilterComponent
