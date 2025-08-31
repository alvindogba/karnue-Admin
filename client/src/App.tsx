import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../Store/store';
import AppRouter from './Router';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-100">
            <AppRouter />
          </div>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
