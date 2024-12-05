import { useRouter } from "next/router"
import Sidebar from "../Sidebar"
import styles from './appshell.module.scss'
import Header from "../Header"

type AppShellProps = {
  children: React.ReactNode
}

const AppShell = (props: AppShellProps) => {
  const { children } = props
  const disableNavbar = ["/auth/login", "/auth/register", "/404"]
  const { pathname } = useRouter();
  const isNoLayout = disableNavbar.includes(pathname);
  return isNoLayout ? (
    <div>{children}</div>

  ) : (
    <div className={styles.layout}>
      <Header />
      <div className={styles.body}>

        <aside className={styles.sidebarWithLogo}>
          <div className={styles.logo}>
            <img src="/images/logo/logo.png" alt="Logo" className={styles.logoImage} />
            <h1 className={styles.logoText}>KOG JKI Immanuel</h1>
          </div>
          <Sidebar />
        </aside>
        <main className={styles.mainContent}>{children}</main>
      </div>

    </div>
  );
}

export default AppShell;