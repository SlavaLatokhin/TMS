import React, {useState} from "react";
import useStyles from "../../styles/styles";
import {
    Button,
    Dialog,
    FormControl,
    Grid,
    InputLabel, MenuItem, Select, SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";

interface Props {
    show: boolean;
    setShow: (show: boolean) => void
}

const CreationSuite: React.FC<Props> = ({show, setShow}) => {
    const classes = useStyles()
    const [suites, setSuites] = useState<string []>(["a", "b", "c", "d"])
    const [selectedSuite, setSelectedSuite] = useState("Не выбрано")

    const handleClose = () => {
        setShow(false)
    }

    const chooseSuite = (e: SelectChangeEvent) => {
        // console.log(e)
        // const index: number = parseInt(e.target.value)
        // console.log(index)
        // const name = suites[index]
        setSelectedSuite(e.target.value)
    }
    return (
        <Dialog
            disableEnforceFocus
            open={show}
            onClose={handleClose}
            classes={{paper: classes.paperCreationSuite}}
        >
            <Grid container style={{
                position: "absolute",
                height: "100%",
                width: "100%"
            }}>
                <Grid xs={9} item style={{padding: 20}}>
                    <Grid>
                        <Typography variant="h6">
                            Название сьюты
                        </Typography>
                        <TextField
                            className={classes.textFieldCreationCase}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Введите название сьюты"
                        />
                    </Grid>
                </Grid>
                <Grid xs={3} item style={{
                    backgroundColor: "#eeeeee", paddingTop: 26, display: "flex",
                    flexDirection: "column", justifyContent: "space-between"
                }}>
                    <Grid style={{marginLeft: 15}}>
                            <Typography style={{marginBottom: 10}}>
                                Родительская сьюта
                            </Typography>

                            <FormControl style={{minWidth: "90%"}}>
                                <InputLabel id="select-suite">Выберите сьюту</InputLabel>
                                <Select
                                    labelId="select-suite"
                                    value={selectedSuite}
                                    label="Выберите сьюту"
                                    onChange={(e) => chooseSuite(e)}
                                    renderValue={(selected) => <Grid>{selected}</Grid>}
                                >
                                    <MenuItem value="Не выбрано">
                                        <em>Не выбрано</em>
                                    </MenuItem>
                                    {suites.map((suite, index) => <MenuItem key={index}
                                                                            value={suite}>{suite}</MenuItem>)}
                                </Select>
                            </FormControl>
                    </Grid>
                    <Grid style={{textAlign: "center"}}>
                        <Grid>
                            <Button onClick={handleClose} style={{
                                marginRight: 7,
                                marginBottom: 20,
                                width: "40%",
                                height: "45%",
                                backgroundColor: "#FFFFFF",
                                color: "#000000",
                            }}
                            >
                                Отменить
                            </Button>
                            <Button style={{
                                marginLeft: 7,
                                marginBottom: 20,
                                width: "40%",
                                height: "45%",
                                backgroundColor: "#696969",
                                color: "#FFFFFF",
                            }}
                            >
                                Сохранить
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
        </Dialog>
    )
}

export default CreationSuite