import { THEME } from '@/lib/types/model';

/**
 * This function handles the theme change logic for the application.
 *
 * @param theme - The current theme of the application
 * @param setTheme - Function to update the theme in the Zustand store
 * @param setIconColor - Function to update the icon color based on the theme
 */
export const handleThemeChange = (
    theme: THEME,
    setTheme: (theme: THEME) => void
) => {
    if (theme === THEME.AMBER) {
        setTheme(THEME.GUN_METAL);
        document.documentElement.classList.toggle('dark', true);
        localStorage.setItem('theme', THEME.GUN_METAL);
    } else {
        setTheme(THEME.AMBER);
        document.documentElement.classList.toggle('dark', false);
        localStorage.setItem('theme', THEME.AMBER);
    }
};
