import LoginPage from '@/components/LoginPage';

export default function Login() {
  return <LoginPage />;
}


// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [token, setToken] = useState(null);

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post('https://your-backend-url.com/api/login', {
//         username,
//         password,
//       });
//       const token = response.data.token;
//       setToken(token);
//       // Store the token in local storage or use it to authenticate the user
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
//       <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//       <button onClick={handleLogin}>Login</button>
//       {token && <div>Welcome, {username}!</div>}
//     </div>
//   );
// };