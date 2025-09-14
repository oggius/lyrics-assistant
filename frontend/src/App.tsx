import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalErrorHandler from './components/GlobalErrorHandler';
import Layout from './components/Layout';
import { SongsListPage, SongPage, AddSongPage } from './pages';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <GlobalErrorHandler>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<SongsListPage />} />
            <Route path="song/:id" element={<SongPage />} />
            <Route path="add" element={<AddSongPage />} />
          </Route>
        </Routes>
      </GlobalErrorHandler>
    </ErrorBoundary>
  );
}

export default App;