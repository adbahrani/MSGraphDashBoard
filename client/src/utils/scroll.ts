export function scrollToSection(sectionId?: string) {
    if (!sectionId) {
        return
    }

    const section = document.getElementById(sectionId)
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
    }
}
