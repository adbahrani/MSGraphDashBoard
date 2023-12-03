import { useNavigate } from 'react-router-dom'

export const Login = () => {
    const navigate = useNavigate()
    const isSignedIn = () => (localStorage.getItem('email') ? true : false)

    if (isSignedIn()) {
        localStorage.clear()
    }
    const handleLogin = (event: any) => {
        const email = event?.target.elements.email.value
        const password = event?.target.elements.password.value
        localStorage.setItem('email', email)
        localStorage.setItem('password', password)
        navigate('/')
    }

    return (
        <>
            <section
                id="home"
                style={{
                    height: '100vh',
                    width: 'calc(100% - 10vw)',
                    backgroundColor: 'lightgreen',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 5vw',
                    textAlign: 'center',
                }}
            >
                <h1>Login</h1>
                <form id="form" onSubmit={handleLogin.bind(this)}>
                    <div>
                        Email: <input name="email" type="text"></input>
                    </div>
                    <div>
                        Password: <input name="password" type="password"></input>
                    </div>
                    <button type="submit">submit</button>
                </form>
            </section>
        </>
    )
}
