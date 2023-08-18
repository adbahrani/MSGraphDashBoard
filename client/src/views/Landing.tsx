import { useEffect } from 'react'
import { Menu } from '../components/Menu'
import { useLocation } from 'react-router-dom'
import { scrollToSection } from '../utils/scroll'

export const Landing = () => {
    const { hash } = useLocation()

    useEffect(() => {
        scrollToSection(hash?.replace('#', ''))
    }, [hash])

    return (
        <>
            <Menu />
            <section
                id="home"
                style={{
                    height: '100vh',
                    width: 'calc(100% - 10vw)',
                    backgroundColor: 'lightcyan',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 5vw',
                    textAlign: 'center',
                }}
            >
                <h1>Landing Page</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi massa purus, fermentum eu placerat
                    eu, mollis sit amet ante. Suspendisse dolor dui, facilisis ut nulla ut, consectetur molestie diam.
                    Sed.
                </p>
            </section>
            <section
                id="about"
                style={{
                    height: '100vh',
                    width: 'calc(100% - 10vw)',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 5vw',
                    textAlign: 'center',
                }}
            >
                <h1>About</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi massa purus, fermentum eu placerat
                    eu, mollis sit amet ante. Suspendisse dolor dui, facilisis ut nulla ut, consectetur molestie diam.
                    Sed.
                </p>
            </section>
            <section
                id="services"
                style={{
                    height: '100vh',
                    width: 'calc(100% - 10vw)',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 5vw',
                    textAlign: 'center',
                }}
            >
                <h1>Services</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi massa purus, fermentum eu placerat
                    eu, mollis sit amet ante. Suspendisse dolor dui, facilisis ut nulla ut, consectetur molestie diam.
                    Sed.
                </p>
            </section>
            <section
                id="contact"
                style={{
                    height: '100vh',
                    width: 'calc(100% - 10vw)',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 5vw',
                    textAlign: 'center',
                }}
            >
                <h1>Contact</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi massa purus, fermentum eu placerat
                    eu, mollis sit amet ante. Suspendisse dolor dui, facilisis ut nulla ut, consectetur molestie diam.
                    Sed.
                </p>
            </section>
        </>
    )
}
