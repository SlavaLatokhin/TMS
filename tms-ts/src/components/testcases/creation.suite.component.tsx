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
import SuiteCaseService from "../../services/suite.case.service";

interface suite {
    id: number;
    name: string;
    parent: null | number;
    project: number;
    url: string;
}

interface Props {
    show: boolean;
    setShow: (show: boolean) => void;
    suites: suite []
}

const CreationSuite: React.FC<Props> = ({show, setShow, suites}) => {
    const classes = useStyles()
    const [selectedSuite, setSelectedSuite] = useState<{ id: number; name: string } | null>(null)
    const [name, setName] = useState("")
    const [namePresence, setNamePresence] = useState(false)

    const handleClose = () => {
        setShow(false)
    }

    const chooseSuite = (e: any) => {
        setSelectedSuite(e.target.value ? {id: e.target.value.id, name: e.target.value.name} : null)
    }

    const createSuite = () => {
        const suite = {
            name: name,
            parent: selectedSuite ? selectedSuite.id : null,
            project: 1,
        }
        SuiteCaseService.createSuite(suite)
        setShow(false)
        setName("")
        setNamePresence(false)
    }

    const onChangeName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let str = e.target.value
        setName(str)
        setNamePresence(true)
    }

    return (
        <Dialog
            disableEnforceFocus
            open={show}
            onClose={handleClose}
            classes={{paper: classes.paperCreationSuite}}
        >
            <form
                style={{
                    display: "flex"
                }}
                // onSubmit={createSuite}
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
                                onChange={(content) => onChangeName(content)}
                                className={classes.textFieldCreationCase}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                autoComplete="off"
                                value={name}
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
                                    value={selectedSuite ? selectedSuite.name : "Не выбрано"}
                                    label="Выберите сьюту"
                                    onChange={(e) => chooseSuite(e)}
                                    renderValue={(selected) => <Grid>{selected}</Grid>}
                                >
                                    <MenuItem value={null as any}>
                                        <em>Не выбрано</em>
                                    </MenuItem>
                                    {suites.map((suite, index) => <MenuItem key={index}
                                                                            value={suite as any}>{suite.name}</MenuItem>)}
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
                                <Button
                                    // type={"submit"}
                                    onClick={createSuite}
                                    style={{
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
            </form>
        </Dialog>
    )
}

export default CreationSuite