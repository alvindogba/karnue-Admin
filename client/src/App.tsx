import { BrowserRouter } from 'react-router-dom';
import AppRouter from './Router';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <AppRouter />
      </div>
    </BrowserRouter>
  );
}

export default App;
