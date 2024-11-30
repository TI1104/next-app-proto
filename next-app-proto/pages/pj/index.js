import Link from "next/link";
import styles from "../../styles/Home.module.css";

export default function ProductsList(){
    return(
        <div className={styles.cotainer} style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh' 
        }}>
            <main className={styles.main} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center' 
            }}>
                <h2 className={styles.title}>どちらか選択してください。</h2>
                <ul style={{ 
                    listStyle: 'none', 
                    padding: 0, 
                    textAlign: 'center' 
                }}>
                    <li style={{ margin: '1rem 0' }}>
                        <Link href="/pj/parent">親用</Link>
                    </li>
                    <li style={{ margin: '1rem 0' }}>
                        <Link href="/pj/care">介護対象用</Link>
                    </li>
                </ul>
            </main>
        </div>
    );
}