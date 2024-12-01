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
            <Sidebar />
            <main className={styles.mainContent}>{children}</main>
          </div>
        </div>
      );
}

export default AppShell;