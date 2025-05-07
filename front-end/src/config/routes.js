import Login from '../pages/Login';
import Register from '../pages/Register';

export const routes = [
  { id: 'login', path: '/', name: 'Iniciar sesión', component: Login },
  { id: 'register', path: '/register', name: 'Registro', component: Register }
];