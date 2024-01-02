import { Alert, Snackbar } from "@mui/material"
import { useCallback, useState } from "react"


export default function useSnackError() {
    const [errorMessage, setErrorMessage] = useState('')

    const handleCloseError = useCallback(() => setErrorMessage(''), [])

    return {
        SnackErrorComponent: () => <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(errorMessage)} autoHideDuration={6000} onClose={handleCloseError}>
            <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                {errorMessage}
            </Alert>
        </Snackbar>,
        setErrorMessage
    }

}