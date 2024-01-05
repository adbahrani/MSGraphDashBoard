export type MenuLink = {
    title: string
    to: string
    activeSet?: Set<string>
    children?: MenuLink[]
    secure?: boolean
}

export type Period = {
    label: string
    value: PeriodValueInDays
}

export type PeriodValueInDays = 30 | 90
