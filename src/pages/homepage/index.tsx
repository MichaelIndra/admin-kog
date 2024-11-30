import Card from '@/components/widgets/card_homepage'
import styles from './homepage.module.scss'


const Homepage = () => {
    const cards = [
        { leftText: 'Hero Section', rightText: '+ Add Data' },
        { leftText: 'Our Pastors', rightText: '+ Add Data' },
        { leftText: 'Incoming Events', rightText: '+ Add Data' },
        { leftText: 'Our Service', rightText: '+ Add Data' },
    ];
    return (
        <div className={styles.homepage}>
            <h1 className={styles.title}>Homepage</h1>
            <div className={styles.cardContainer}>
                {cards.map((card, index) => (
                    <Card
                        key={index}
                        leftText={card.leftText}
                        rightText={card.rightText}
                    />
                ))}
            </div>
        </div>
    );
}

export default Homepage;