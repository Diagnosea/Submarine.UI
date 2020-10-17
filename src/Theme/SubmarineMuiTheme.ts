import { createMuiTheme } from "@material-ui/core/styles";
import brand from "./Brand";

export const submarineMuiTheme = createMuiTheme({
    palette: {
        primary: {
            main: brand.orange,
            dark: brand.darkOrange,
            contrastText: brand.white,
        },
        secondary: {
            main: brand.blue,
            dark: brand.darkBlue,
            contrastText: brand.white,
        },
        success: {
            main: brand.success
        },
        error: {
            main: brand.error,
        }
    }
})


// primary?: PaletteColorOptions;
// secondary?: PaletteColorOptions;
// error?: PaletteColorOptions;
// warning?: PaletteColorOptions;
// info?: PaletteColorOptions;
// success?: PaletteColorOptions;

export default submarineMuiTheme;
