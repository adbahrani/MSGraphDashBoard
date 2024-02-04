export type MenuLink = {
    title: string
    to: string
    activeSet?: Set<string>
    children?: MenuLink[]
    secure?: boolean
    isButton?: boolean
}

export type Period = {
    label: string
    value: PeriodValueInDays
}

export type PeriodValueInDays = 30 | 90
