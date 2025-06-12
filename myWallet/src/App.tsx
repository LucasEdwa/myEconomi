import { RouterProvider } from 'react-router';
import { Provider } from 'react-redux';
import router from './Router';
import store from './store';


function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App