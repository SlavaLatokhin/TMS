import AddCircleIcon from "@mui/icons-material/AddCircle";
import {Chip, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import React, {useState} from "react";
import useStyles from "../../styles/styles";
import {Grid, Button, Dialog, IconButton, TextField, InputAdornment, Typography} from "@mui/material";

interface Props {
    show: boolean;
    setShow: (show: boolean) => void
}

const CreationCase: React.FC<Props> = ({show, setShow}) => {
    const classes = useStyles()

    const [tagInput, setTagInput] = useState("")
    const [tag, setTag] = useState("")
    const [tagPresence, setTagPresence] = useState(false)
    const [tags, setTags] = useState<string []>([])

    const [link, setLink] = useState("")
    const [links, setLinks] = useState<string []>([])
    const [linkPresence, setLinkPresence] = useState(false)

    const [suites, setSuites] = useState<string []>(["a", "b", "c", "d"])
    const [selectedSuite, setSelectedSuite] = useState("a")

    const handleClose = () => {
        setTag("")
        setTagInput("")
        setTags([])
        setTagPresence(false)
        setLink("")
        setLinkPresence(false)
        setLinks([])
        setShow(false)
    }

    const handleDelete = (index: number) => {
        let oldTags = tags.slice()
        oldTags.splice(index, 1)
        setTags(oldTags)
    }

    const handleDeleteLink = (index: number) => {
        let oldLinks = links.slice()
        oldLinks.splice(index, 1)
        setLinks(oldLinks)
    }

    const createTag = () => {
        setTags((prevState) => (prevState.concat([tag])))
        setTagPresence(false)
        setTagInput("")
    }

    const createLink = () => {
        setLinks((prevState) => (prevState.concat([link])))
        setLinkPresence(false)
        setLink("")
    }

    const keyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && tagPresence) {
            createTag()
        }
    }

    const keyPressLink = (e: React.KeyboardEvent<HTMLDivElement>) => {
        console.log(linkPresence)
        if (e.key === "Enter" && linkPresence) {
            createLink()
        }
    }

    const onChangeTagContent = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const strInput = e.target.value.trimStart().replace(/ {2,}/g, ' ')
        const tag = strInput.trimEnd()
        if (tag.length > 0) {
            setTag(tag)
            setTagInput(strInput)
            setTagPresence(true)
        } else {
            setTagInput(strInput)
            setTagPresence(false)
        }
    }

    const onChangeLinkContent = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const strInput = e.target.value.trim()
        if (strInput.length > 0) {
            setLink(strInput)
            setLinkPresence(true)
        } else {
            setLink(strInput)
            setLinkPresence(false)
        }
    }

    const chooseSuite = (e: SelectChangeEvent) => {
        // const index: number = parseInt(e.target.value)
        // const name = suites[index]
        setSelectedSuite(e.target.value)
    }

    return (
        <Dialog
            disableEnforceFocus
            open={show}
            onClose={handleClose}
            classes={{paper: classes.paperCreationTestCase}}
        >
            {/*<DialogTitle disableTypography className={classes.dialogTitle}>*/}
            {/*    <h2>Создание тест-кейса</h2>*/}
            {/*    <IconButton onClick={handleClose}>*/}
            {/*        <CloseIcon/>*/}
            {/*    </IconButton>*/}
            {/*</DialogTitle>*/}

            {/*<DialogContentText style={{fontSize: 20, color: "black"}}>*/}
            <Grid container style={{
                position: "absolute",
                height: "100%",
                width: "100%"
            }}>
                <Grid xs={9} item style={{padding: 20}}>
                    <Grid>
                        <Typography variant="h6">
                            Название тест-кейса
                        </Typography>
                        <TextField
                            className={classes.textFieldCreationCase}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Введите название тест-кейса"
                        />
                    </Grid>

                    <Grid className={classes.gridContent}>
                        <Typography variant="h6">
                            Описание
                        </Typography>
                        <TextField
                            className={classes.textFieldCreationCase}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Введите описание тест-кейса"
                            multiline
                            minRows={4}
                            maxRows={5}
                        />
                    </Grid>
                    <Grid className={classes.gridContent}>
                        <Typography variant="h6">
                            Тэги
                        </Typography>
                        <TextField
                            value={tagInput}
                            onChange={(content) => onChangeTagContent(content)}
                            className={classes.textFieldCreationCase}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Введите тэг"
                            onKeyPress={(key) => keyPress(key)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton size={"small"} onClick={() => {
                                            if (tagPresence) {
                                                createTag()
                                            }
                                        }}>
                                            <AddCircleIcon fontSize={"large"}/>
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Grid className={classes.stackTags}>
                            {tags.map((tag, index) =>
                                <Chip key={index} label={tag} style={{margin: 3, maxWidth: "95%"}}
                                      onDelete={() => handleDelete(index)}/>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid xs={3} item style={{
                    backgroundColor: "#eeeeee", paddingTop: 26, display: "flex",
                    flexDirection: "column", justifyContent: "space-between"
                }}>
                    <Grid style={{marginLeft: 15}}>
                        <Grid style={{marginBottom: 34}}>
                            <Typography style={{marginBottom: 10}}>
                                Сьюта
                            </Typography>

                            <FormControl required style={{minWidth: "90%"}}>
                                <InputLabel id="select-suite">Выберите сьюту</InputLabel>
                                <Select
                                    labelId="select-suite"
                                    value={selectedSuite}
                                    label="Выберите сьюту"
                                    onChange={(e) => chooseSuite(e)}
                                    renderValue={(selected) => <Grid>{selected}</Grid>}
                                >
                                    {suites.map((suite, index) => <MenuItem key={index}
                                                                            value={suite}>{suite}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid style={{marginBottom: 34}}>
                            <Typography>
                                Время выполнения
                            </Typography>
                            <TextField
                                style={{marginTop: 10}}
                                className={classes.textFieldCreationCase}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                label="Введите время"
                            />
                        </Grid>
                        <Grid>
                            <Typography>
                                Ссылки
                            </Typography>
                            <TextField
                                value={link}
                                onChange={(content) => onChangeLinkContent(content)}
                                style={{marginTop: 10}}
                                className={classes.textFieldCreationCase}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                label="Введите URL"
                                onKeyPress={(key) => keyPressLink(key)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton size={"small"} onClick={() => {
                                                if (linkPresence) {
                                                    createLink()
                                                }
                                            }}>
                                                <AddCircleIcon fontSize={"medium"}/>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Grid className={classes.stackTags}>
                                {links.map((link, index) =>
                                    <Grid>
                                        <Chip key={index} label={link} style={{
                                            margin: 3,
                                            maxWidth: "95%",
                                            color: "#0000FF",
                                            textDecoration: "underline"
                                        }}
                                              onDelete={() => handleDeleteLink(index)}
                                              onClick={() => {
                                                  const url = link.match(/^http[s]?:\/\//) ? link : '//' + link;
                                                  window.open(url, '_blank')
                                              }}
                                        />
                                        <br/>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
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
    );
}

export default CreationCase