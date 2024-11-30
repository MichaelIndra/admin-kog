import { useRouter } from "next/router"
import Sidebar from "../Sidebar"
import styles from './appshell.module.scss'
import Header from "../Header"

type AppShellProps = {
    children: React.ReactNode
}

const AppShell = (props: AppShellProps) => {
    const { children } = props

    return (
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