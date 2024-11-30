import styles from './header.module.scss'

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.rightContent}>
                <h1>My Application</h1>
            </div>
            
        </header>
    )
}

export default Header;