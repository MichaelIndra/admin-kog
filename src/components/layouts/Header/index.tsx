import styles from './header.module.scss'
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';



const Header = () => {
    const [userName, setUserName] = useState<string | null>(null);
    useEffect(() => {
        // Membaca cookies
        const getCookie = (name: string) => {
          const cookies = document.cookie.split('; ');
          const cookie = cookies.find((row) => row.startsWith(`${name}=`));
          return cookie ? cookie.split('=')[1] : null;
        };
    
        const token = getCookie('token'); 
        if (token) {
          try {
            const decoded = jwtDecode<{ name: string }>(token); 
            // console.log(decoded) masih dapet e {sub: 1, role: 'GUEST', iat: 1733017688, exp: 1733021288}
            setUserName(decoded.name); 
          } catch (err) {
            console.error('Invalid token:', err);
          }
        }
      }, []); 
    return (
        <header className={styles.header}>
            <div className={styles.rightContent}>
                <h1>{userName || 'Guest'}</h1>
            </div>
            
        </header>
    )
}

export default Header;