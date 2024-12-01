/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './login.module.scss'
import { useState } from 'react';
import { useRouter } from 'next/router';
import config from '@/config'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  // const [isDialogOpen, setIsDialogOpen] = useState(false);



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        console.log(response)
        if (!response.ok) {
          setError( 'Invalid credentials');
          throw new Error('Invalid credentials');
        }
  
        const data = await response.json();
        console.log(data)
        // localStorage.setItem('token', data.message); // Simpan token
        document.cookie = `token=${data.access_token}; Path=/; Secure; SameSite=Strict; Max-Age=3600`;
        router.push('/homepage'); // Arahkan ke homepage
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      }
    };
  
    return (
      <div className={styles.loginContainer}>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.logoContainer}>
          <img src="/images/logo/logo.png" alt="Login Icon" className={styles.logoImage} />
          <span className={styles.title}>KOG JKI Immanuel</span>
        </div>
        
        {error && <p className={styles.error}>{error}</p>}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          </div>
          <button type="submit" className={styles.button}>Login</button>
        </form>
      </div>
    );
  };

  export default Login;