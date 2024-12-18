import Link from 'next/link';
import styles from './sidebar.module.scss'
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();
  const listSidebar = [
    { label: 'Homepage', path: '/homepage', icon: '/images/icons/ic_home.svg' },
    { label: 'About', path: '/about', icon: '/images/icons/ic_book.svg' },
    { label: 'Service', path: '/service', icon: '/images/icons/ic_group.svg' },
    { label: 'Give', path: '/give', icon: '/images/icons/ic_money.svg' },
    { label: 'Admin', path: '/admin', icon: '/images/icons/ic_admin.svg' },
    { label: 'Jemaat', path: '/jemaat', icon: '/images/icons/ic_group.svg' },

  ]

  function logoutHandle(){
    const confirmLogout = window.confirm("Apakah Anda yakin ingin logout?");
    if (confirmLogout) {
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      router.push('/auth/login');
    }
  }

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      
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
      <div className={styles.logout} onClick={logoutHandle}>
        <img src="/images/icons/ic_logout.svg" alt="Logout Icon" className={styles.logoutIcon} />
        <span className={styles.logoutText}>Logout</span>
      </div>
    </aside>
  );
}

export default Sidebar;