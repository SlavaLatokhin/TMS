import React, {ChangeEvent, useEffect, useState} from 'react';
import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    Paper,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Zoom
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Button} from "@material-ui/core";
import LineChartComponent from "./charts/line.chart.component";
import PieChartComponent from "./charts/pie.chart.component";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import moment, {Moment} from "moment";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {useNavigate} from "react-router-dom";
import {test, testPlan, user} from "../models.interfaces";
import ProjectService from "../../services/project.service";

const Project: React.FC = () => {
    const navigate = useNavigate();
    const labels = [['НАЗВАНИЕ ТЕСТ-ПЛАНА', '#000000'], ['ВСЕГО ТЕСТОВ', '#000000'], ['PASSED', '#24b124'],
        ['SKIPPED', '#c4af30'], ['FAILED', '#bd2828'], ['RETEST', '#6c6c6c'],
        ['ДАТА ИЗМЕНЕНИЯ', '#000000'], ['КЕМ ИЗМЕНЕНО', '#000000']];
    const checkboxesLabels = ["passed", "skipped", "failed", "retest"];
    const getMinStatusIndex = () => labels.findIndex((value) => checkboxesLabels.includes(value[0].toLowerCase()))
    const minStatusIndex = getMinStatusIndex();
    const maxStatusIndex = minStatusIndex + checkboxesLabels.length - 1;

    const [isSwitched, setSwitch] = React.useState(false);
    const handleOnSwitch = (event: ChangeEvent<HTMLInputElement>) => setSwitch(event.target.checked);
    const [showFilter, setShowFilter] = React.useState(false);
    const handleOnOpenFilter = () => setShowFilter(!showFilter);
    const [startDate, setStartDate] = React.useState<Moment | null>(moment("01.01.1970"));
    const [endDate, setEndDate] = React.useState<Moment | null>(moment());
    const handleChangeStartDate = (newValue: Moment | null) => setStartDate(newValue);
    const handleChangeEndDate = (newValue: Moment | null) => setEndDate(newValue);
    const handleOnOpenProjectSettings = () => navigate('/projectSettings');
    const handleOnShowStatus = (status: string) => {
        setStatusesToShow({...statusesShow, [status]: !statusesShow[status]})
    };
    const [tests, setTests] = useState<test[]>([])
    const [testPlans, setTestPlans] = useState<testPlan[]>([])
    const [users, setUsers] = useState<user[]>([])
    const testPlanDates: string[] = []
    const editorIds: (number | null)[] = ((new Array<number | null>(testPlans.length)).fill(null))

    const projectValue = JSON.parse(localStorage.getItem("currentProject") ?? '')
    const currentUsername = localStorage.getItem('currentUsername')

    const tableData = testPlans.map((value, indexOfTestPlan) => {
        testPlanDates.push(value.started_at)
        const results: { [key: string]: number; } = {
            "all": value.tests.length,
            "passed": 0,
            "skipped": 0,
            "failed": 0,
            "retest": 0,
        }
        value.tests.sort((a, b) =>
            moment(b.updated_at, "YYYY-MM-DDThh:mm").valueOf() - moment(a.updated_at, "YYYY-MM-DDThh:mm").valueOf())
        testPlanDates[testPlanDates.length - 1] = value.tests[0]?.updated_at ?? testPlanDates[testPlanDates.length - 1]
        if (value.tests.length > 0) {
            const currentTest = tests.find((test) => test.id === value.tests[0].id)
            editorIds[indexOfTestPlan] = currentTest?.user ?? editorIds[indexOfTestPlan]
        }
        const editor = (editorIds[indexOfTestPlan] != null) ?
            users.find((value) => value.id === editorIds[indexOfTestPlan]) : null
        const editorName = (editor != null) ? editor.username : "Не назначен"
        value.tests.forEach((test) => {
            results[test.current_result?.status]++
        });
        return [value.name, results.all, results.passed, results.skipped, results.failed, results.retest, testPlanDates[testPlanDates.length - 1], editorName]
    });
    tableData.sort(([, , , , , , firstDate,], [, , , , , , secondDate,]) =>
        (moment(secondDate, "YYYY-MM-DDThh:mm").valueOf() - moment(firstDate, "YYYY-MM-DDThh:mm").valueOf()))
    const personalTableData = tableData.filter((value) => value[value.length - 1] == currentUsername)

    const [statusesShow, setStatusesToShow] = React.useState<{ [key: string]: boolean; }>(
        {
            "passed": true,
            "skipped": true,
            "failed": true,
            "retest": true
        }
    );
    const charts = [<LineChartComponent tests={tests}/>, <PieChartComponent tests={tests}/>];

    useEffect(() => {
        ProjectService.getTestPlans().then((response) => {
            const testPlansData: testPlan[] = response.data
            setTestPlans(testPlansData.filter((value) => value.project === projectValue.id))

            ProjectService.getTests().then((response) => {
                const testsData: test[] = response.data
                setTests(testsData.filter((value) => value.project === projectValue.id))

                ProjectService.getUsers().then((response) => {
                    setUsers(response.data)

                })
            })
        })
            .catch((e) => {
                console.log(e);
            });
    }, [])

    const activityTitle = <Stack direction={"row"}>
        <Zoom in={!isSwitched}>
            <Typography fontSize={24} mr={'5px'} ml={'5px'}>
                Активность проекта
            </Typography>
        </Zoom>
        <Switch checked={isSwitched} onChange={handleOnSwitch}/>
        <Zoom in={!isSwitched}>
            <Typography fontSize={24} mr={'5px'} ml={'5px'} color={'grey'}>
                Моя
            </Typography>
        </Zoom>
    </Stack>
    const switchedActivityTitle = <Stack direction={"row"}>
        <Zoom in={isSwitched}>
            <Typography fontSize={24} mr={'5px'} ml={'5px'} color={'grey'}>
                Проекта
            </Typography>
        </Zoom>
        <Switch checked={isSwitched} onChange={handleOnSwitch}/>
        <Zoom in={isSwitched}>
            <Typography fontSize={24} mr={'5px'} ml={'5px'}>
                Моя активность
            </Typography>
        </Zoom>
    </Stack>

    const filter = <Zoom in={showFilter} style={{marginBottom: '10px'}}>
        <Grid sx={{display: 'flex', justifyContent: 'center'}}>
            <FormGroup sx={{display: 'flex', justifyContent: 'center', flexDirection: 'row'}}>
                {checkboxesLabels.map((value) =>
                    <FormControlLabel
                        control={<Checkbox checked={statusesShow[value]} onClick={() => handleOnShowStatus(value)}/>}
                        label={value.toUpperCase()}/>
                )}
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <div style={{marginLeft: '10px'}}>
                        <DesktopDatePicker
                            label="Выберите дату начала"
                            inputFormat="DD/MM/YYYY"
                            value={startDate}
                            onChange={handleChangeStartDate}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </div>
                    <div style={{marginLeft: '10px'}}>
                        <DesktopDatePicker
                            label="Выберите дату окончания"
                            inputFormat="DD/MM/YYYY"
                            value={endDate}
                            onChange={handleChangeEndDate}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </div>
                </LocalizationProvider>
            </FormGroup>
        </Grid>
    </Zoom>

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <Grid sx={{display: 'flex', justifyContent: 'center', mt: '20px'}}>
                {tests.length > 0 ? charts.map((chart) =>
                        <div style={{width: "45%"}}>
                            {chart}
                        </div>)
                    : <></>}
            </Grid>
            <Grid sx={{width: '100%', justifyContent: 'center', pt: '50px'}}>
                <Paper
                    elevation={5}
                    sx={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        padding: "20px 10px 10px 10px",
                    }}>
                    <Stack>
                        <Stack direction={"row"} margin={"auto"} mb={'10px'}>
                            {isSwitched ? switchedActivityTitle : activityTitle}
                            <Button variant="contained"
                                    style={{marginLeft: '10px'}}
                                    onClick={handleOnOpenFilter}>Фильтр</Button>
                            <Button variant="contained"
                                    style={{marginLeft: '10px'}}
                                    onClick={handleOnOpenProjectSettings}
                            >Настройки</Button>
                        </Stack>
                        {showFilter ? filter : null}
                        <TableContainer component={Paper}>
                            <Table stickyHeader>
                                <TableHead sx={{mb: '20px'}}>
                                    <TableRow>
                                        {labels.map(([value, color]) => {
                                            if (!checkboxesLabels.includes(value.toLowerCase())) {
                                                return <TableCell>
                                                    <Typography color={color} fontWeight={'bolder'}
                                                                align={'center'}>{value}</Typography>
                                                </TableCell>
                                            }
                                            if (statusesShow[value.toLowerCase()]) {
                                                return <TableCell>
                                                    <Typography color={color} fontWeight={'bolder'}
                                                                align={'center'}>{value}</Typography>
                                                </TableCell>
                                            }
                                            return <></>;
                                        })}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {(isSwitched ? personalTableData : tableData)?.map(
                                        ([title, all, passed, skipped, failed, retest, date, tester]) =>
                                            (!moment(date, "YYYY-MM-DDThh:mm").isBetween(startDate, endDate, undefined, "[]")) ? null :
                                                (<TableRow>
                                                    {[title, all, passed, skipped, failed, retest,
                                                        moment(date, "YYYY-MM-DDThh:mm")
                                                            .format("DD.MM.YYYY"), tester].map(
                                                        (value, index) => {
                                                            if (index < minStatusIndex || index > maxStatusIndex) {
                                                                return <TableCell>
                                                                    <Typography align={'center'}>{value}</Typography>
                                                                </TableCell>
                                                            }
                                                            if (statusesShow[checkboxesLabels[index - minStatusIndex]]) {
                                                                return <TableCell>
                                                                    <Typography align={'center'}>{value}</Typography>
                                                                </TableCell>
                                                            }
                                                            return <></>;
                                                        }
                                                    )}
                                                </TableRow>)
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </Paper>
            </Grid>
        </div>
    );
};

export default Project;