export const fetchWrapper = (originalFetch: any) => (input: RequestInfo | URL, init?: RequestInit | undefined) => {
    if (input.toString().startsWith('https://graph.microsoft.com')) {
        return originalFetch('/ms-graph-proxy', {
            method: 'POST',
            body: JSON.stringify({
                url: input,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } else {
        return originalFetch(input, init)
    }
}
