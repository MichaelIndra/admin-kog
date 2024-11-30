import Link from 'next/link';
import styles from './sidebar.module.scss'
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();
  const listSidebar = [
    { label: 'Homepage', path: '/homepage', icon: '/images/icons/ic_home.svg' },
    { label: 'About', path: '/about', icon: '/images/icons/ic_book.svg' }

  ]
  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <img src="/images/logo/logo.png" alt="Logo" className={styles.logoImage} />
        <h1 className={styles.logoText}>KOG JKI Immanuel</h1>
      </div>
      {/* Navigation */}
      <nav>
        <ul>
          {listSidebar.map((link, index) => (
            <li key={index}>
              <Link href={link.path} className={
                router.pathname === link.path
                  ? styles.activeLink
                  : styles.inactiveLink
              }>

                <img
                  src={link.icon}
                  alt={link.label}
                  className={styles.icon}
                />
                {link.label}

              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;