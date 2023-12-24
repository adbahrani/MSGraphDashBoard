export type MenuLink = {
    title: string
    to: string
    activeSet?: Set<string>
    children?: MenuLink[]
}
