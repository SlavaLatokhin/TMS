import React, {useState} from "react";
import {
    Box,
    Button,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent
} from "@mui/material";
import {ThemeProvider, createTheme} from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from "@mui/material/IconButton";

const ColorModeContext = React.createContext({
    toggleColorMode: () => {
    }
});

const Settings: React.FC = () => {
    const [mode, setMode] = React.useState<'light' | 'dark'>('light');
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode],
    );

    const [language, setLanguage] = useState("Русский")

    const handleOnChangeLanguage = (event: SelectChangeEvent<string>) => setLanguage(event.target.value)
    const handleOnBackClick = () => window.location.assign('/profile')

    return <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
            <Paper style={{
                padding: '10px 10px 10px 10px',
                display: 'flex',
                flexDirection: 'column',
                margin: '15px auto auto auto',
                width: '50%',
                alignItems: 'center'
            }}>

                <Button style={{alignSelf: "start"}} onClick={handleOnBackClick}>
                    <ArrowBackIcon/>
                </Button>
                <form
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        margin: 1,
                        minWidth: 200
                    }}>
                    <InputLabel>Язык интерфейса</InputLabel>
                    <Select
                        autoWidth
                        label="Язык интерфейса"
                        value={language}
                        onChange={handleOnChangeLanguage}
                    >
                        <MenuItem value={"Русский"}>Русский</MenuItem>
                        <MenuItem value={"English"}>English</MenuItem>
                    </Select>
                    <Box
                        sx={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'background.default',
                            color: 'text.primary',
                            borderRadius: 1,
                            p: 3,
                        }}
                    >
                        {theme.palette.mode} mode
                        <IconButton sx={{ml: 1}} onClick={colorMode.toggleColorMode} color="inherit">
                            {theme.palette.mode === 'dark' ? <Brightness7Icon/> : <Brightness4Icon/>}
                        </IconButton>
                    </Box>

                    <Button type={"submit"} variant={"contained"}
                            sx={{margin: '10px 10px 10px 10px'}}>Сохранить</Button>
                </form>
            </Paper>
        </ThemeProvider>
    </ColorModeContext.Provider>
}

export default Settings;