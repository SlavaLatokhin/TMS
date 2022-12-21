import AddCircleIcon from "@mui/icons-material/AddCircle";
import {Chip, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import React, {useEffect, useState} from "react";
import useStyles from "../../styles/styles";
import {Grid, Button, Dialog, IconButton, TextField, InputAdornment, Typography} from "@mui/material";
import ProjectService from "../../services/project.service";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {alpha} from "@material-ui/core";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import FolderCopyOutlinedIcon from "@mui/icons-material/FolderCopyOutlined";
import BlockIcon from "@mui/icons-material/Block";
import CheckboxTree from 'react-checkbox-tree';
import {param, testPlan} from "../models.interfaces";
import TestPlanService from "../../services/testplan.service";
import SuiteCaseService from "../../services/suite.case.service";

interface Props {
    show: boolean;
    setShow: (show: boolean) => void
}

interface Node {
    label: string;
    value: string;
    children?: Array<Node>;
    disabled?: boolean;
    icon?: boolean
    showCheckbox?: boolean;
}

const ProjectSettings: React.FC<Props> = ({show, setShow}) => {
    const classes = useStyles()

    const [statusInput, setStatusInput] = useState("")
    const [status, setStatus] = useState("")
    const [statusPresence, setStatusPresence] = useState(false)
    const defaultStatuses: { name: string, color: string }[] = [
        {name: 'PASSED', color: '#24b124'}, {name: 'SKIPPED', color: '#c4af30'}, {name: 'FAILED', color: '#bd2828'},
        {name: 'RETEST', color: '#6c6c6c'}, {name: 'UNTESTED', color: '#a5a4a4'}]
    const [statuses, setStatuses] = useState<string[]>([])

    const [link, setLink] = useState("")
    const [links, setLinks] = useState<string []>([])
    const [linkPresence, setLinkPresence] = useState(false)
    const projectValue = JSON.parse(localStorage.getItem("currentProject") ?? '')
    const [projectName, setProjectName] = useState(projectValue.name)

    const [projectDescription, setProjectDescription] = React.useState(projectValue.description)



    const [disable, setDisable] = useState(false)
    const [paramsChecked, setParamsChecked] = useState<Array<string>>([])
    const [paramsExpanded, setParamsExpanded] = useState<Array<string>>([])
    const [params, setParams] = useState<param [] | null>(null)
    const nodes = [{value: 'no', label: 'Без параметров', icon: <BlockIcon className={classes.icons}/>},
        {value: 'all', label: 'Все параметры', children: nodesChildren(), disabled: disable}];


    function nodesChildren() {
        let arr: Node[] = [];
        params?.map((param) => {
            let flag = false
            for (let node in arr) {
                if (arr[node].label == param.group_name) {
                    if (arr[node].children) {/*а это всегда true, но пусть будет*/
                        arr[node].children?.push({
                            value: String(param.id),
                            label: param.data,
                            disabled: disable,
                            icon: false
                        })
                    }
                    flag = true
                }
            }
            if (!flag) {
                arr.push({
                    value: param.group_name,
                    label: param.group_name,
                    children: [{value: String(param.id), label: param.data, disabled: disable, icon: false}],
                    disabled: disable
                })
            }
        })

        return arr
    }


    const onChangeProjectName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProjectName(e.target.value)
    }

    const onChangeProjectDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProjectDescription(e.target.value)
    }

    const handleClose = () => {
        setStatus("")
        setStatusInput("")
        setStatuses([])
        setStatusPresence(false)
        setLink("")
        setLinkPresence(false)
        setLinks([])
        setShow(false)
    }

    const handlePatch = () => {
        ProjectService.patchProject({name: projectName, description: projectDescription}, projectValue.id)
            .then(r => {});
        setStatus("")
        setStatusInput("")
        setStatuses([])
        setStatusPresence(false)
        setLink("")
        setLinkPresence(false)
        setLinks([])
        setShow(false)
    }

    const handleDelete = (index: number) => {
        let oldStatuses = statuses.slice()
        oldStatuses.splice(index, 1)
        setStatuses(oldStatuses)
    }

    const handleDeleteLink = (index: number) => {
        let oldLinks = links.slice()
        oldLinks.splice(index, 1)
        setLinks(oldLinks)
    }

    const createStatus = () => {
        setStatuses((prevState) => (prevState.concat([status])))
        setStatusPresence(false)
        setStatusInput("")
    }

    const createLink = () => {
        setLinks((prevState) => (prevState.concat([link])))
        setLinkPresence(false)
        setLink("")
    }

    const keyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && statusPresence) {
            createStatus()
        }
    }

    const keyPressLink = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && linkPresence) {
            createLink()
        }
    }

    const onChangeStatusContent = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const strInput = e.target.value.trimStart().replace(/ {2,}/g, ' ')
        const status = strInput.trimEnd()
        if (status.length > 0) {
            setStatus(status)
            setStatusInput(strInput)
            setStatusPresence(true)
        } else {
            setStatusInput(strInput)
            setStatusPresence(false)
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

    useEffect(() => {
            TestPlanService.getParameters().then((response) => {
                const localParams = response.data
                setParams(localParams)
            })
                .catch((e) => {
                    console.log(e);
                });
        }, []
    )


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
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <div style={{width: "11%", minWidth: 120, paddingRight: "3%", paddingLeft: "2%"}}>
                            <Typography variant="h6" style={{paddingTop: "24px"}}>
                                Название
                            </Typography>
                        </div>

                        <TextField
                            className={classes.textFieldSelectCreationCaseSuite}
                            style={{paddingRight: "8%"}}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={projectName}
                            label="Изменить название проекта"
                            onChange={onChangeProjectName}
                        />
                    </div>

                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <div style={{width: "11%", minWidth: 120, paddingRight: "3%", paddingLeft: "2%"}}>
                            <Typography variant="h6" style={{paddingTop: "24px"}}>
                                Описание
                            </Typography>
                        </div>

                        <TextField
                            className={classes.textFieldSelectCreationCaseSuite}
                            style={{paddingRight: "8%"}}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={projectDescription}
                            label="Изменить описание проекта"
                            multiline
                            minRows={2}
                            maxRows={5}
                            onChange={onChangeProjectDescription}
                        />
                    </div>

                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <div style={{width: "11%", minWidth: 120, paddingRight: "3%", paddingLeft: "2%"}}>
                            <Typography variant="h6"
                                        style={{
                                            paddingTop: "14px"
                                        }}>
                                Статусы результатов
                            </Typography>
                        </div>

                        <TextField
                            value={statusInput}
                            onChange={(content) => onChangeStatusContent(content)}
                            className={classes.textFieldSelectCreationCaseSuite}
                            style={{paddingRight: "8%"}}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            disabled
                            label="Введите новый статус"
                            onKeyPress={(key) => keyPress(key)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton size={"small"} onClick={() => {
                                            if (statusPresence) {
                                                createStatus()
                                            }
                                        }}>
                                            <AddCircleIcon fontSize={"large"}/>
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <div style={{width: "11%", minWidth: 120, paddingRight: "3%", paddingLeft: "2%"}}/>
                        <div style={{paddingRight: "8%"}}>
                            <Grid className={classes.stackTags}>
                                {defaultStatuses.map((status, index) =>
                                    <Chip key={index} label={status.name}
                                          style={{
                                              margin: 3,
                                              maxWidth: "95%",
                                              backgroundColor: status.color,
                                              color: "white"
                                          }}/>
                                )}
                                {statuses.map((status, index) =>
                                    <Chip key={index} label={status} style={{margin: 3, maxWidth: "95%"}}
                                          onDelete={() => handleDelete(index)}/>
                                )}
                            </Grid>
                        </div>
                    </div>
                    {/*<Grid container spacing={2} className={classes.gridContent}>*/}
                    {/*    <Grid item xs={2}>*/}
                    {/*        <Typography variant="h6">*/}
                    {/*            Параметры*/}
                    {/*        </Typography>*/}
                    {/*    </Grid>*/}
                    {/*    <Grid item xs={10}>*/}
                    {/*        <FormControl style={{minWidth: "50%"}} className={classes.textFieldSelectCreationCaseSuite}>*/}
                    {/*            {params ? (<CheckboxTree*/}
                    {/*                    nodes={nodes}*/}
                    {/*                    checked={paramsChecked}*/}
                    {/*                    expanded={paramsExpanded}*/}
                    {/*                    // nativeCheckboxes={true}*/}
                    {/*                    onCheck={(paramsChecked) => {*/}
                    {/*                        setParamsChecked(paramsChecked)*/}
                    {/*                        if (paramsChecked.find(x => x == 'no')) {*/}
                    {/*                            setDisable(true)*/}
                    {/*                            setParamsChecked(['no'])*/}
                    {/*                            setParamsExpanded([])*/}
                    {/*                        } else {*/}
                    {/*                            setDisable(false)*/}
                    {/*                        }*/}
                    {/*                    }}*/}
                    {/*                    onExpand={(paramsExpanded) => setParamsExpanded(paramsExpanded)}*/}
                    {/*                    icons={{*/}
                    {/*                        check: <CheckBoxOutlinedIcon className={classes.icons}/>,*/}
                    {/*                        uncheck: <CheckBoxOutlineBlankIcon className={classes.icons}/>,*/}
                    {/*                        halfCheck: <CheckBoxOutlinedIcon style={{color: alpha("#8956FF", 0.6)}}/>,*/}
                    {/*                        expandClose: <KeyboardArrowRightIcon className={classes.icons}/>,*/}
                    {/*                        expandOpen: <KeyboardArrowUpIcon className={classes.icons}/>,*/}
                    {/*                        expandAll: <IndeterminateCheckBoxOutlinedIcon className={classes.icons}/>,*/}
                    {/*                        collapseAll: <IndeterminateCheckBoxOutlinedIcon className={classes.icons}/>,*/}
                    {/*                        parentClose: <FolderCopyOutlinedIcon className={classes.icons}/>,*/}
                    {/*                        parentOpen: <FolderCopyOutlinedIcon className={classes.icons}/>,*/}
                    {/*                        // leaf: <ArticleOutlinedIcon className={classes.icons}/>,*/}
                    {/*                    }}*/}
                    {/*                    // className={classes.tree}*/}
                    {/*                />) :*/}
                    {/*                (<CheckboxTree nodes={[{*/}
                    {/*                    value: 'no',*/}
                    {/*                    label: 'Без параметров',*/}
                    {/*                    disabled: true,*/}
                    {/*                    showCheckbox: false,*/}
                    {/*                    icon: <BlockIcon className={classes.icons}/>*/}
                    {/*                }]}*/}
                    {/*                />)*/}
                    {/*            }*/}

                    {/*        </FormControl>*/}

                    {/*    </Grid>*/}
                    {/*</Grid>*/}
                </Grid>
                <Grid xs={3} item style={{
                    backgroundColor: "#eeeeee", paddingTop: 26, display: "flex",
                    flexDirection: "column", justifyContent: "space-between"
                }}>
                    <div style={{marginLeft: 15}}>
                        <div>
                            <Typography>
                                Участники
                            </Typography>
                            <TextField
                                value={link}
                                onChange={(content) => onChangeLinkContent(content)}
                                style={{marginTop: 10}}
                                className={classes.textFieldSelectCreationCaseSuite}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                label="Введите имя/почту/ссылку "
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
                        </div>
                    </div>
                    <Grid>
                        <div style={{marginBottom: 15, textAlign: "center"}}>
                            <Button onClick={handleClose} style={{
                                margin: "0px 5px 5px 5px",
                                minWidth: 100,
                                width: "40%",
                                height: "45%",
                                backgroundColor: "#FFFFFF",
                                color: "#000000",
                            }}
                            >
                                Отменить
                            </Button>
                            <Button onClick={handlePatch} style={{
                                margin: "0px 5px 5px 5px",
                                minWidth: 100,
                                width: "40%",
                                height: "45%",
                                backgroundColor: "#696969",
                                color: "#FFFFFF",
                            }}
                            >
                                Сохранить
                            </Button>
                        </div>
                    </Grid>
                </Grid>

            </Grid>
        </Dialog>
    );
}

export default ProjectSettings