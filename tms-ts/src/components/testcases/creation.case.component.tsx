import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import useStyles from "../../styles/styles";
import {Grid, Button, Dialog, TextField, Typography} from "@mui/material";
import SuiteCaseService from "../../services/suite.case.service";
import {CustomWidthTooltip, myCase, suite, treeSuite} from "./suites.component";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface Props {
    show: boolean;
    setShow: (show: boolean) => void;
    suites: suite [];
    selectedSuiteCome: { id: number, name: string } | null;
    setTreeSuites: (treeSuites: treeSuite[]) => void;
    infoCaseForEdit: myCase | null;
    setInfoCaseForEdit: (myCase: null) => void
    setDetailedCaseInfo: (myCase: { show: boolean, myCase: myCase }) => void,
    detailedCaseInfo: { show: boolean, myCase: myCase },
    setLastEditCase: (id: number) => void
}

const CreationCase: React.FC<Props> = ({
                                           show,
                                           setShow,
                                           suites,
                                           selectedSuiteCome,
                                           setTreeSuites,
                                           infoCaseForEdit,
                                           setInfoCaseForEdit,
                                           setDetailedCaseInfo,
                                           detailedCaseInfo,
                                           setLastEditCase
                                       }) => {
    const classes = useStyles()

    const [tagInput, setTagInput] = useState("")
    const [tag, setTag] = useState("")
    const [tagPresence, setTagPresence] = useState(false)
    const [tags, setTags] = useState<string []>([])

    const [link, setLink] = useState("")
    const [links, setLinks] = useState<string []>([])
    const [linkPresence, setLinkPresence] = useState(false)

    const [selectedSuite, setSelectedSuite] = useState<{ id: number; name: string }>({
        id: suites[0].id,
        name: suites[0].name,
    })

    const [name, setName] = useState("")
    const [namePresence, setNamePresence] = useState(false)

    const [estimate, setEstimate] = useState("")
    const [estimateNumber, setEstimateNumber] = useState<number | null>(null)
    const [estimatePresence, setEstimatePresence] = useState(false)

    const [scenario, setScenario] = useState("")
    const [scenarioPresence, setScenarioPresence] = useState(false)

    const [fillFieldName, setFillFieldName] = useState(false)
    const [fillFieldScenario, setFillFieldScenario] = useState(false)

    const [setup, setSetup] = useState("")
    const [teardown, setTeardown] = useState("")

    useEffect(() => {
        if (selectedSuiteCome) {
            setSelectedSuite(selectedSuiteCome)
        }
        if (infoCaseForEdit) {
            setName(infoCaseForEdit.name)
            setNamePresence(true)
            setScenario(infoCaseForEdit.scenario)
            setScenarioPresence(true)
            setSetup(infoCaseForEdit.setup)
            setTeardown(infoCaseForEdit.teardown)
            if (infoCaseForEdit.estimate) {
                setEstimate(infoCaseForEdit.estimate.toString())
                setEstimateNumber(infoCaseForEdit.estimate)
            }
        }
    }, [selectedSuiteCome])

    const handleClose = () => {
        setTag("")
        setTagInput("")
        setTags([])
        setTagPresence(false)
        setLink("")
        setLinkPresence(false)
        setLinks([])
        setShow(false)
        setName("")
        setNamePresence(false)
        setScenario("")
        setScenarioPresence(false)
        setEstimate("")
        setEstimateNumber(null)
        setFillFieldName(false)
        setFillFieldScenario(false)
        setSetup("")
        setTeardown("")
        setInfoCaseForEdit(null)
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

    const onChangeEstimateContent = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const strInput = e.target.value

        if (strInput.length > 0) {
            setEstimate(strInput)
            setEstimateNumber(parseInt(strInput, 10))
            setEstimatePresence(true)
        } else if (strInput.length == 0) {
            setEstimate("")
            setEstimateNumber(null)
            setEstimatePresence(false)
        }
    }

    const onChangeName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let str = e.target.value.trimStart()
        if (str.length > 0) {
            setName(str)
            setNamePresence(true)
            setFillFieldName(false)
        } else {
            setName(str)
            setNamePresence(false)
        }
    }

    const onChangeScenario = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let str = e.target.value.trimStart()
        if (str.length > 0) {
            setScenario(str)
            setScenarioPresence(true)
            setFillFieldScenario(false)
        } else {
            setScenario(str)
            setScenarioPresence(false)
        }
    }

    const onChangeSetup = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let str = e.target.value
        if (str.length > 0) {
            setSetup(str)
        } else {
            setSetup(str)
        }
    }

    const onChangeTeardown = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let str = e.target.value
        if (str.length > 0) {
            setTeardown(str)
        } else {
            setTeardown(str)
        }
    }
    const createCase = () => {
        const projectId = JSON.parse(localStorage.getItem("currentProject") ?? '{"id" : 1}').id
        if (namePresence && scenarioPresence) {
            const myCase = {
                name: name,
                project: projectId,
                suite: selectedSuite.id,
                scenario: scenario,
                estimate: estimateNumber,
                teardown: teardown,
                setup: setup
            }
            if (infoCaseForEdit) {
                SuiteCaseService.editCase({...myCase, url: infoCaseForEdit.url, id: infoCaseForEdit.id}).then(() => {
                    SuiteCaseService.getTreeSuites().then((response) => {
                        setTreeSuites(response.data)
                    })
                })
                if (infoCaseForEdit.id === detailedCaseInfo.myCase.id && detailedCaseInfo.show) {
                    setLastEditCase(infoCaseForEdit.id)
                    setDetailedCaseInfo({show: true, myCase: {...myCase, id: infoCaseForEdit.id}})
                }
            } else {
                SuiteCaseService.createCase(myCase).then(() => {
                    SuiteCaseService.getTreeSuites().then((response) => {
                        setTreeSuites(response.data)
                    })
                })
            }
            handleClose()
        } else if (!namePresence && !scenarioPresence) {
            document.getElementById("nameCaseTextField")?.focus();
            setFillFieldName(true)
            setFillFieldScenario(true)
        } else if (!namePresence) {
            document.getElementById("nameCaseTextField")?.focus();
            setFillFieldName(true)
        } else {
            document.getElementById("scenarioCaseTextField")?.focus();
            setFillFieldScenario(true)
        }
    }

    const chooseSuite = (e: any) => {
        setSelectedSuite({id: e.target.value.id, name: e.target.value.name})
    }

    return (
        <Dialog
            disableEnforceFocus
            open={show}
            onClose={handleClose}
            classes={{paper: classes.paperCreationTestCase}}
        >
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
                        <CustomWidthTooltip
                            title={<Grid style={{display: "flex", flexDirection: 'row'}}><WarningAmberIcon
                                sx={{fontSize: 25, marginRight: 1}}/> <Typography> Заполните это
                                поле.</Typography></Grid>} placement="top-start" arrow
                            open={fillFieldScenario}>
                            <TextField
                                id="nameCaseTextField"
                                className={classes.textFieldSelectCreationCaseSuite}
                                onChange={(content) => onChangeName(content)}
                                variant="outlined"
                                value={name}
                                margin="normal"
                                autoComplete="off"
                                required
                                fullWidth
                                label="Введите название тест-кейса"
                            />
                        </CustomWidthTooltip>
                    </Grid>

                    <Grid className={classes.gridContent}>
                        <Typography variant="h6">
                            Описание
                        </Typography>
                        <CustomWidthTooltip
                            title={<Grid style={{display: "flex", flexDirection: 'row'}}><WarningAmberIcon
                                sx={{fontSize: 25, marginRight: 1}}/> <Typography> Заполните это
                                поле.</Typography></Grid>} placement="top-start" arrow
                            open={fillFieldScenario}>
                            <TextField
                                id="scenarioCaseTextField"
                                className={classes.textFieldSelectCreationCaseSuite}
                                onChange={(content) => onChangeScenario(content)}
                                variant="outlined"
                                value={scenario}
                                margin="normal"
                                fullWidth
                                required
                                label="Введите описание тест-кейса"
                                autoComplete="off"
                                multiline
                                minRows={4}
                                maxRows={5}
                            />
                        </CustomWidthTooltip>
                    </Grid>
                    <Grid className={classes.gridContent}>
                        <Typography variant="h6">
                            Подготовка теста
                        </Typography>

                        <TextField
                            id="scenarioCaseTextField"
                            className={classes.textFieldSelectCreationCaseSuite}
                            onChange={(content) => onChangeSetup(content)}
                            variant="outlined"
                            value={setup}
                            margin="normal"
                            fullWidth
                            label="Введите инструкции"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            maxRows={3}
                        />
                    </Grid>
                    <Grid className={classes.gridContent}>
                        <Typography variant="h6">
                            Очистка после теста
                        </Typography>

                        <TextField
                            id="scenarioCaseTextField"
                            className={classes.textFieldSelectCreationCaseSuite}
                            onChange={(content) => onChangeTeardown(content)}
                            variant="outlined"
                            value={teardown}
                            margin="normal"
                            fullWidth
                            label="Введите инструкции"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            maxRows={3}
                        />
                    </Grid>
                    {/*<Grid className={classes.gridContent}>*/}
                    {/*    <Typography variant="h6">*/}
                    {/*        Тэги*/}
                    {/*    </Typography>*/}
                    {/*    <TextField*/}
                    {/*        value={tagInput}*/}
                    {/*        onChange={(content) => onChangeTagContent(content)}*/}
                    {/*        className={classes.textFieldSelectCreationCaseSuite}*/}
                    {/*        variant="outlined"*/}
                    {/*        margin="normal"*/}
                    {/*        autoComplete="off"*/}
                    {/*        fullWidth*/}
                    {/*        label="Введите тэг"*/}
                    {/*        onKeyPress={(key) => keyPress(key)}*/}
                    {/*        InputProps={{*/}
                    {/*            endAdornment: (*/}
                    {/*                <InputAdornment position="end">*/}
                    {/*                    <IconButton size={"small"} onClick={() => {*/}
                    {/*                        if (tagPresence) {*/}
                    {/*                            createTag()*/}
                    {/*                        }*/}
                    {/*                    }}>*/}
                    {/*                        <AddCircleIcon fontSize={"large"}/>*/}
                    {/*                    </IconButton>*/}
                    {/*                </InputAdornment>*/}
                    {/*            ),*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*    <Grid className={classes.stackTags}>*/}
                    {/*        {tags.map((tag, index) =>*/}
                    {/*            <Chip key={index} label={tag} style={{margin: 3, maxWidth: "95%"}}*/}
                    {/*                  onDelete={() => handleDelete(index)}/>*/}
                    {/*        )}*/}
                    {/*    </Grid>*/}
                    {/*</Grid>*/}
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

                            <FormControl required style={{minWidth: "90%"}}
                                         className={classes.textFieldSelectCreationCaseSuite}>
                                <InputLabel id="select-suite">Выберите
                                    сьюту</InputLabel>
                                <Select
                                    labelId="select-suite"
                                    value={selectedSuite.name}
                                    label="Выберите сьюту"
                                    onChange={(e) => chooseSuite(e)}
                                    renderValue={(selected) => <Grid>{selected}</Grid>}
                                >
                                    {suites.map((suite, index) => <MenuItem key={index}
                                                                            value={suite as any}>{suite.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid style={{marginBottom: 34}}>
                            <Typography>
                                Время выполнения
                            </Typography>
                            <TextField
                                value={estimate}
                                style={{marginTop: 10}}
                                className={classes.textFieldSelectCreationCaseSuite}
                                onChange={(content) => onChangeEstimateContent(content)}
                                variant="outlined"
                                margin="normal"
                                type={'number'}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                autoComplete="off"
                                fullWidth
                                label="Введите время"
                            />
                        </Grid>
                        {/*<Grid>*/}
                        {/*    <Typography>*/}
                        {/*        Ссылки*/}
                        {/*    </Typography>*/}
                        {/*    <TextField*/}
                        {/*        value={link}*/}
                        {/*        onChange={(content) => onChangeLinkContent(content)}*/}
                        {/*        style={{marginTop: 10}}*/}
                        {/*        className={classes.textFieldSelectCreationCaseSuite}*/}
                        {/*        variant="outlined"*/}
                        {/*        margin="normal"*/}
                        {/*        autoComplete="off"*/}
                        {/*        fullWidth*/}
                        {/*        label="Введите URL"*/}
                        {/*        onKeyPress={(key) => keyPressLink(key)}*/}
                        {/*        InputProps={{*/}
                        {/*            endAdornment: (*/}
                        {/*                <InputAdornment position="end">*/}
                        {/*                    <IconButton size={"small"} onClick={() => {*/}
                        {/*                        if (linkPresence) {*/}
                        {/*                            createLink()*/}
                        {/*                        }*/}
                        {/*                    }}>*/}
                        {/*                        <AddCircleIcon fontSize={"medium"}/>*/}
                        {/*                    </IconButton>*/}
                        {/*                </InputAdornment>*/}
                        {/*            ),*/}
                        {/*        }}*/}
                        {/*    />*/}
                        {/*    <Grid className={classes.stackTags}>*/}
                        {/*        {links.map((link, index) =>*/}
                        {/*            <Grid>*/}
                        {/*                <Chip key={index} label={link} style={{*/}
                        {/*                    margin: 3,*/}
                        {/*                    maxWidth: "95%",*/}
                        {/*                    color: "#0000FF",*/}
                        {/*                    textDecoration: "underline"*/}
                        {/*                }}*/}
                        {/*                      onDelete={() => handleDeleteLink(index)}*/}
                        {/*                      onClick={() => {*/}
                        {/*                          const url = link.match(/^http[s]?:\/\//) ? link : '//' + link;*/}
                        {/*                          window.open(url, '_blank')*/}
                        {/*                      }}*/}
                        {/*                />*/}
                        {/*                <br/>*/}
                        {/*            </Grid>*/}
                        {/*        )}*/}
                        {/*    </Grid>*/}
                        {/*</Grid>*/}
                    </Grid>
                    <Grid style={{textAlign: "center"}}>
                        <Grid>
                            <Button onClick={handleClose} style={{
                                margin: "0px 4px 20px 5px",
                                width: "45%",
                                minWidth: 100,
                                height: "45%",
                                backgroundColor: "#FFFFFF",
                                color: "#000000",
                            }}
                            >
                                Отменить
                            </Button>
                            <Button
                                onClick={createCase}
                                style={{
                                    margin: "0px 5px 20px 4px",
                                    width: "45%",
                                    minWidth: 100,
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