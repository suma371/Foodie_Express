import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Router from './Router';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Router />
      </Layout>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
