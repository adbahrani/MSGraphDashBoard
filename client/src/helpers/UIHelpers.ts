export const getResponsiveVarient = varient => {
    const width = window.innerWidth
    switch (varient) {
        case 'h2':
            if (width < 1100) {
                return 'h3'
            }
            return varient
            break

        default:
            return varient
    }
}

export const smBreakPoint = 800
