import { Routes, Route } from 'react-router-dom';
import { routes } from './config/routes';

export default function App() {
  return (
    <Routes>
      {routes.map(route => (
        <Route key={route.id} path={route.path} element={<route.component />} />
      ))}
    </Routes>
  );
}