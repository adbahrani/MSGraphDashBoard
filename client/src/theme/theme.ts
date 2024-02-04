export const primaryColor = '#4C65EB'
const theme = {
    spacing: 8,
    palette: {
        primary: {
            main: primaryColor,
        },
    },
    typography: {
        fontFamily: 'Poppins, sans-serif', // Set your custom font family
        fontSize: 14, // Set the default font size
        fontWeightRegular: 400, // Set the default font weight for regular text
        fontWeightBold: 700, // Set the default font weight for bold text
    },
    components: {
        MuiLink: {
            styleOverrides: {
                root: {
                    display: 'inline-block',
                    textDecoration: 'none',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                },
            },
        },
    },
}

export default theme
