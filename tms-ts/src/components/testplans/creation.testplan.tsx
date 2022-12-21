import React, {useEffect, useState} from "react";
import useStyles from "../../styles/styles";
import {
    Button,
    Chip,
    Dialog,
    FormControl,
    Grid, IconButton, InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import moment, {Moment} from "moment";
import TestPlanService from "../../services/testplan.service";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import BlockIcon from '@mui/icons-material/Block';
import {alpha} from "@material-ui/core";
import {treeSuite} from "../testcases/suites.component";
import {param, testPlan} from "../models.interfaces";


interface Props {
    show: boolean;
    setShow: (show: boolean) => void;
    testPlans: testPlan[];
    params: param[] | null;
    treeSuites: treeSuite [];
    isForEdit: testPlan | null;
    setIsForEdit: (isForEdit: null) => void;
}

interface Node {
    label: string;
    value: string;
    children?: Array<Node>;
    disabled?: boolean;
    icon?: boolean
    showCheckbox?: boolean;
}

const CreationTestPlan: React.FC<Props> = ({
                                               show,
                                               setShow,
                                               testPlans,
                                               params,
                                               treeSuites,
                                               isForEdit,
                                               setIsForEdit,
                                           }) => {
    const classes = useStyles()

    const [link, setLink] = useState("")
    const [links, setLinks] = useState<string []>([])
    const [linkPresence, setLinkPresence] = useState(false)

    const [selectedTestPlan, setSelectedTestPlan] = useState<{ id: number, name: string } | null>(null)

    const [name, setName] = useState("")

    const [startDate, setStartDate] = React.useState<Moment | null>(moment())
    const [endDate, setEndDate] = React.useState<Moment | null>(moment())

    const [paramsChecked, setParamsChecked] = useState<Array<string>>([])
    const [paramsExpanded, setParamsExpanded] = useState<Array<string>>([])
    const [disable, setDisable] = useState(false)

    const [testsChecked, setTestsChecked] = useState<Array<string>>([])
    const [testsExpanded, setTestsExpanded] = useState<Array<string>>([])

    // console.log(testsChecked)

    useEffect(() => {
        if (isForEdit) {
            setName(isForEdit.name)
            if (isForEdit.parent) {
                const parent = testPlans.find(x => x.id == isForEdit.parent)
                if (parent) {
                    setSelectedTestPlan({id: isForEdit.parent, name: parent.title})
                }
            }
            if (isForEdit.parameters) {
                setParamsChecked(isForEdit.parameters.map(x => String(x)))
            }
            // console.log(isForEdit.tests)
            setTestsChecked(isForEdit.tests.map(x => String(x.case.id)))
            setStartDate(moment(isForEdit.started_at))
            setEndDate(moment(isForEdit.due_date))
        }
    }, [isForEdit])

    const handleStartDate = (newValue: Moment | null) => {
        setStartDate(newValue);
    };

    const handleEndDate = (newValue: Moment | null) => {
        setEndDate(newValue);
    };

    const handleClose = () => {
        setLink("")
        setLinkPresence(false)
        setLinks([])
        setShow(false)
        setName("")
        setStartDate(moment())
        setEndDate(moment())
        setParamsChecked([])
        setParamsExpanded([])
        setDisable(false)
        setTestsChecked([])
        setTestsExpanded([])
        setIsForEdit(null)
        setSelectedTestPlan(null)
    }

    const handleDeleteLink = (index: number) => {
        let oldLinks = links.slice()
        oldLinks.splice(index, 1)
        setLinks(oldLinks)
    }

    const createLink = () => {
        setLinks((prevState) => (prevState.concat([link])))
        setLinkPresence(false)
        setLink("")
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

    const chooseTestPlan = (e: any) => {
        setSelectedTestPlan({id: e.target.value.id, name: e.target.value.name})
    }

    const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const keyPressLink = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && linkPresence) {
            createLink()
        }
    }

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

    const nodes = [{value: 'no', label: 'Без параметров', icon: <BlockIcon className={classes.icons}/>},
        {value: 'all', label: 'Все параметры', children: nodesChildren(), disabled: disable}];

    function testsNodes(treeSuites: treeSuite[]) {
        let arr: Node[] = []
        treeSuites.map((suite) => {
            if (suite.children.length != 0) {
                let children: Node[] = []
                if (suite.test_cases.length != 0) {
                    suite.test_cases.map((test) => children.push({
                        value: String(test.id),
                        label: test.name,
                        icon: false
                    }))
                }
                children = children.concat(testsNodes(suite.children))
                arr.push({
                    value: "s" + suite.id,
                    label: suite.name,
                    children: children
                })
            } else {
                if (suite.test_cases.length != 0) {
                    let tests: Node[] = []
                    suite.test_cases.map((test) => tests.push({
                        value: String(test.id),
                        label: test.name,
                        icon: false
                    }))
                    arr.push({
                        value: "s" + suite.id,
                        label: suite.name,
                        children: tests,
                    })
                }
            }
        })
        return arr
    }


    const createTestPlan = () => {
        let params = []
        if (!paramsChecked.includes('no') && paramsChecked.length != 0) {
            for (let i of paramsChecked) {
                params.push(Number(i))
            }
        }
        let tests = []
        for (let i of testsChecked) {
            tests.push(Number(i))
        }
        const testPlan = {
            name: name,
            project: 1,
            parent: selectedTestPlan ? selectedTestPlan.id : null,
            test_cases: tests,
            parameters: params,
            started_at: startDate ? startDate.format('YYYY-MM-DDTHH:mm') : "01.01.1970",
            due_date: endDate ? endDate.format('YYYY-MM-DDTHH:mm') : "01.01.1970",
        }
        if (isForEdit) {
            TestPlanService.editTestPlan({
                ...testPlan,
                id: isForEdit.id,
                child_test_plans: isForEdit.child_test_plans,
                url: isForEdit.url,
                is_archive: isForEdit.is_archive
            }).catch((e) => {
                console.log(e)
            })
        } else {
            TestPlanService.createTestPlan(testPlan).then((response) => {
                // console.log(response.data[0])
                window.location.assign("/testplans/" + response.data[0].id)
            })
                .catch((e) => {
                    console.log(e);
                });
        }
        handleClose()

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
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <Typography variant="h6" style={{padding: 25}}>
                                Название
                            </Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <TextField
                                id="nameTestPlanTextField"
                                className={classes.textFieldTestplansAndTests}
                                onChange={onChangeName}
                                variant="outlined"
                                value={name}
                                margin="normal"
                                autoComplete="off"
                                required
                                fullWidth
                                label="Введите название тест-плана"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} className={classes.gridContent}>
                        <Grid item xs={2}>
                            <Typography variant="h6">
                                Параметры
                            </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <FormControl style={{minWidth: "50%"}} className={classes.textFieldTestplansAndTests}>
                                {params ? (<CheckboxTree
                                        nodes={nodes}
                                        checked={paramsChecked}
                                        expanded={paramsExpanded}
                                        // nativeCheckboxes={true}
                                        onCheck={(paramsChecked) => {
                                            setParamsChecked(paramsChecked)
                                            if (paramsChecked.find(x => x == 'no')) {
                                                setDisable(true)
                                                setParamsChecked(['no'])
                                                setParamsExpanded([])
                                            } else {
                                                setDisable(false)
                                            }
                                        }}
                                        onExpand={(paramsExpanded) => setParamsExpanded(paramsExpanded)}
                                        icons={{
                                            check: <CheckBoxOutlinedIcon className={classes.icons}/>,
                                            uncheck: <CheckBoxOutlineBlankIcon className={classes.icons}/>,
                                            halfCheck: <CheckBoxOutlinedIcon style={{color: alpha("#8956FF", 0.6)}}/>,
                                            expandClose: <KeyboardArrowRightIcon className={classes.icons}/>,
                                            expandOpen: <KeyboardArrowUpIcon className={classes.icons}/>,
                                            expandAll: <IndeterminateCheckBoxOutlinedIcon className={classes.icons}/>,
                                            collapseAll: <IndeterminateCheckBoxOutlinedIcon className={classes.icons}/>,
                                            parentClose: <FolderCopyOutlinedIcon className={classes.icons}/>,
                                            parentOpen: <FolderCopyOutlinedIcon className={classes.icons}/>,
                                            // leaf: <ArticleOutlinedIcon className={classes.icons}/>,
                                        }}
                                        // className={classes.tree}
                                    />) :
                                    (<CheckboxTree nodes={[{
                                        value: 'no',
                                        label: 'Без параметров',
                                        disabled: true,
                                        showCheckbox: false,
                                        icon: <BlockIcon className={classes.icons}/>
                                    }]}
                                    />)
                                }

                            </FormControl>

                        </Grid>
                    </Grid>
                    <Grid container spacing={0} className={classes.gridContent}>
                        <Grid item xs={2}>
                            <Typography variant="h6">
                                Тест-кейсы
                            </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <FormControl style={{minWidth: "50%"}} className={classes.textFieldTestplansAndTests}>
                                {treeSuites ? (<CheckboxTree
                                        nodes={testsNodes(treeSuites)}
                                        checked={testsChecked}
                                        expanded={testsExpanded}
                                        onCheck={(testsChecked) => {
                                            setTestsChecked(testsChecked)
                                        }}
                                        onExpand={(testsExpanded) => setTestsExpanded(testsExpanded)}
                                        // nativeCheckboxes={true}
                                        showExpandAll={true}
                                        icons={{
                                            check: <CheckBoxOutlinedIcon className={classes.icons}/>,
                                            uncheck: <CheckBoxOutlineBlankIcon className={classes.icons}/>,
                                            halfCheck: <CheckBoxOutlinedIcon style={{color: alpha("#8956FF", 0.6)}}/>,
                                            expandClose: <KeyboardArrowRightIcon className={classes.icons}/>,
                                            expandOpen: <KeyboardArrowUpIcon className={classes.icons}/>,
                                            expandAll: <AddIcon className={classes.icons}/>,
                                            collapseAll: <RemoveIcon className={classes.icons}/>,
                                            parentClose: <FolderCopyOutlinedIcon className={classes.icons}/>,
                                            parentOpen: <FolderCopyOutlinedIcon className={classes.icons}/>,
                                        }}/>) :
                                    (<CheckboxTree nodes={[{
                                        value: 'no_tests',
                                        label: 'Без тестов',
                                        disabled: true,
                                        showCheckbox: false,
                                        icon: <BlockIcon className={classes.icons}/>
                                    }]}
                                    />)
                                }
                            </FormControl>
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
                                Родительский тест-план
                            </Typography>

                            <FormControl style={{minWidth: "90%"}} className={classes.textFieldTestplansAndTests}>
                                <InputLabel id="select-test-plan">Выберите тест-план</InputLabel>
                                <Select
                                    labelId="select-test-plan"
                                    value={selectedTestPlan ? selectedTestPlan.name : "Не выбрано"}
                                    label="Выберите тест-план"
                                    onChange={(e) => chooseTestPlan(e)}
                                    renderValue={(selected) => <Grid>{selected}</Grid>}
                                >
                                    {testPlans.map((plan, index) => <MenuItem key={index}
                                                                              value={plan as any}>{plan.title}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid style={{marginBottom: 10}}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DesktopDatePicker
                                    label="Дата начала"
                                    inputFormat="DD/MM/YYYY"
                                    value={startDate}
                                    onChange={handleStartDate}
                                    className={classes.textFieldTestplansAndTests}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid style={{marginBottom: 34}}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DesktopDatePicker
                                    label="Дата окончания"
                                    inputFormat="DD/MM/YYYY"
                                    value={endDate}
                                    onChange={handleEndDate}
                                    className={classes.textFieldTestplansAndTests}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        {/*<Grid>
                            <Typography>
                                Ссылки
                            </Typography>
                            <TextField
                                value={link}
                                onChange={(content) => onChangeLinkContent(content)}
                                style={{marginTop: 10}}
                                className={classes.textFieldTestplansAndTests}
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
                        </Grid>*/}
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
                                onClick={createTestPlan}
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
        </Dialog>
    );
}

export default CreationTestPlan