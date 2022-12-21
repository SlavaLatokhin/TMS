import {test, testResult} from "../models.interfaces";
import {
    Box,
    Chip,
    Divider, FormControl,
    Grid,
    IconButton,
    InputLabel,
    Link, MenuItem, Select,
    Table,
    TableBody,
    TableCell,
    TableRow, TextField,
    Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, {useEffect, useState} from "react";
import moment from "moment";
import TableTestPlans from "./table.testplans.component";
import {Button} from "@material-ui/core";
import useStyles from "../../styles/styles";
import TestPlanService from "../../services/testplan.service";

const DetailedTestInfo = (props: { test: test, setDetailedTestInfo: (data: { show: boolean, test: test }) => void, showEnterResult: boolean, setShowEnterResult: (show: boolean) => void }) => {

    const classes = useStyles()
    const {test, setDetailedTestInfo, showEnterResult, setShowEnterResult} = props;

    const [selectedStatus, setSelectedStatus] = useState<{ id: number, name: string } | null>(null)
    const [name, setName] = useState("")
    const [num, setNum] = useState<number>();

    const onChangeName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let str = e.target.value.trimStart()
        setName(str)
    }

    const onChangeExecutionTime = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let num = Number(e.target.value)
        setNum(num)
    }

    const statuses: { id: number, name: string, color: string }[] = [{
        id: 1,
        name: 'Passed',
        color: '#24b124'
    }, {id: 2, name: 'Skipped', color: '#c4af30'}, {id: 0, name: 'Failed', color: '#bd2828'}, {
        id: 4,
        name: 'Blocked',
        color: '#6c6c6c'
    }, {id: 5, name: 'Untested', color: '#a5a4a4'}, {id: 3, name: "Broken", color: '#724127'}]

    // useEffect(() => {
    //     if (typeof (test.current_result) == "string") {
    //         const current_result = test.test_results.find(x => x.id == Math.max(...test.test_results.map(el => el.id)))
    //         console.log(current_result)
    //         if (current_result) {
    //             test.current_result = current_result
    //         }
    //     }
    // })

    const handleShowEnterResult = () => setShowEnterResult(true)
    const chooseStatus = (e: any) => {
        setSelectedStatus({id: e.target.value.id, name: e.target.value.name})
    }

    function getCurrentResult(i: testResult) {
        let curRes = statuses.find(x => x.id == i?.status)
        if (typeof (i) == "string") {
            curRes = statuses.find(x => x.name == i)
        }
        return curRes ? curRes :
            {
                id: 5,
                name: 'Untested',
                color: '#a5a4a4'
            }
    }

    const handleClose = () => {
        // window.location.reload()
        setNum(0)
        setName("")
        setSelectedStatus(null)
        setShowEnterResult(false)

        // setDetailedTestInfo({show: true, test: test})

    }

    const createTestResult = () => {
        const testResult = {
            status: selectedStatus ? selectedStatus.id : getCurrentResult(test.current_result).id,
            comment: name,
            execution_time: num ? num : null,
            user: 1
        }
        TestPlanService.createTestResult(testResult, test.id).then((response) => {
            console.log(response)
        })
            .catch((e) => {
            console.log(e);
        });
        if (selectedStatus) {
            // @ts-ignore
            test.current_result = selectedStatus.name
        }
        handleClose()
        // window.location.reload() /*TODO перезагружать и отображать нужный тест*/
    }

    // console.log(test)

    return (
        <Grid style={{padding: 20, wordBreak: "break-word"}}>
            <Grid>
                <Grid style={{display: "flex", justifyContent: "space-between"}}>
                    <Grid container spacing={3}>
                        <Grid item>
                            <Typography variant="h5">
                                {test.id}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h5">
                                {test.case.name}
                            </Typography>
                        </Grid>
                    </Grid>
                    <IconButton size={"small"} onClick={() => setDetailedTestInfo({show: false, test: test})}>
                        <CloseIcon/>
                    </IconButton>
                </Grid>

                {/*<Divider style={{margin: "10px 0px 10px 0px"}}/>*/}
            </Grid>
            {/*<Link href={"/testcases/"}>
                Перейти к тест-кейсу
            </Link>*/}
            <Grid container spacing={1}>
                <Grid item sx={{fontWeight: 'bold'}}>
                    Дата создания:
                </Grid>
                <Grid item>
                    {moment(test.created_at, 'YYYY-MM-DDTHH:mm').format('DD/MM/YYYY HH:mm')}
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item sx={{fontWeight: 'bold'}}>
                    Назначенный пользователь:
                </Grid>
                <Grid item>
                    {test.user ? test.user : "Не назначено"} {/*TODO искать не id, а имя*/}
                </Grid>
            </Grid>
            {test.case.estimate &&
            (<Grid container spacing={2}>
                <Grid item sx={{fontWeight: 'bold'}}>
                    Время выполнения:
                </Grid>
                <Grid item>
                    {test.case.estimate}
                </Grid>
            </Grid>)}
            {test.case.setup &&
            (<Grid>
                <Grid sx={{fontWeight: 'bold'}}>
                    Подготовка теста:
                </Grid>
                <Grid>
                    {test.case.setup}
                </Grid>
            </Grid>)}
            {test.case.teardown &&
            (<Grid>
                <Grid sx={{fontWeight: 'bold'}}>
                    Очистка после теста:
                </Grid>
                <Grid>
                    {test.case.teardown}
                </Grid>
            </Grid>)}

            <Grid sx={{fontWeight: 'bold'}}>
                Описание:
            </Grid>
            <Grid sx={{paddingBottom: 3}}>
                {test.case.scenario}
            </Grid>

            <Grid container spacing={1}>
                <Grid item sx={{fontWeight: 'bold', paddingTop: 0}}>
                    Результат:
                </Grid>
                {showEnterResult ?
                    (/*<FormControl style={{minWidth: "90%"}} className={classes.textFieldTestplansAndTests}>
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
                    </FormControl>*/
                        <Grid item>
                            <FormControl /*style={{minWidth: "35%"}}*/ size="small">
                                <Select
                                    value={selectedStatus ? selectedStatus.name : getCurrentResult(test.current_result).name}
                                    onChange={(e) => chooseStatus(e)}
                                    renderValue={(selected) => <Grid>{selected}</Grid>}>
                                    {statuses.map((status, index) => <MenuItem key={index}
                                                                               value={status as any}>{status.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>)
                    :
                    (<Grid item>
                        <Chip label={getCurrentResult(test.current_result).name}
                              style={{
                                  margin: 3,
                                  maxWidth: "95%",
                                  backgroundColor: getCurrentResult(test.current_result).color,
                                  color: "white"
                              }}/>
                    </Grid>)}

            </Grid>
            {showEnterResult && (
                <Grid>
                    <Grid sx={{fontWeight: 'bold'}}>
                        Комментарии:
                    </Grid>
                    <TextField
                        id="enterResultTextField"
                        className={classes.textFieldTestplansAndTests}
                        onChange={(content) => onChangeName(content)}
                        variant="outlined"
                        value={name}
                        margin="normal"
                        autoComplete="off"
                        fullWidth
                        multiline
                        minRows={2}
                        maxRows={3}
                        label="Введите комментарии к результату теста"
                    />
                    <Grid container spacing={1}>
                        <Grid item sx={{fontWeight: 'bold'}}>
                            Время выполнения:
                        </Grid>
                        <Grid item>
                            <TextField
                                type="number"
                                id="executionTimeTextField"
                                size="small"
                                // className={classes.textFieldTestplansAndTests}
                                onChange={(content) => onChangeExecutionTime(content)}
                                value={num}
                                autoComplete="off"
                            />
                            {/*<TextField
                                type="number"
                                id="outlined-basic"
                                label="Outlined"
                                variant="outlined"
                                onChange={(e) => setExecutionTime(e.target.value)}
                                value={executionTime}
                                // type="number"
                                // id="executionTimeTextField"
                                // className={classes.textFieldTestplansAndTests}
                                // onChange={(e) => setExecutionTime(e.target.value)}
                                // value={executionTime}
                                // margin="normal"
                                // autoComplete="off"
                                // fullWidth
                            />*/}
                        </Grid>
                    </Grid>
                </Grid>
            )}
            <Grid sx={{
                marginTop: 1,
                marginBottom: 3
            }}>
                <Button variant="outlined" style={{
                    minWidth: "20%",
                    height: "33%",
                    backgroundColor: "#696969",
                    color: "#FFFFFF",
                }}
                        onClick={showEnterResult ? createTestResult : handleShowEnterResult}>{showEnterResult ? "Сохранить" : "Внести результат"}</Button>
            </Grid>
            {test.test_results.length != 0 &&
            (<Grid>
                <Grid sx={{fontWeight: 'bold'}}>
                    Предыдущие результаты:
                </Grid>
                <Table>
                    <TableBody>
                        {test.test_results.slice(0).reverse().map((testResult, index) =>
                            <TableRow key={index}>
                                <TableCell sx={{maxWidth: 20, paddingTop: 0}}>
                                    <Grid>
                                        <Grid item>
                                            <Chip label={getCurrentResult(testResult).name}
                                                  style={{
                                                      margin: 3,
                                                      maxWidth: "95%",
                                                      backgroundColor: getCurrentResult(testResult).color,
                                                      color: "white"
                                                  }}/>
                                        </Grid>
                                        <Grid item>
                                            {moment(testResult.updated_at, 'YYYY-MM-DDTHH:mm').format('DD/MM/YY HH:mm')}
                                        </Grid>
                                        <Grid item sx={{fontWeight: 'bold'}}>
                                            {testResult.user} {/*TODO отображать не id, а имя*/}
                                        </Grid>

                                    </Grid>
                                </TableCell>
                                <TableCell align="left" style={{verticalAlign: 'top', paddingTop: 3}}>
                                    <Grid sx={{
                                        fontWeight: 'bold',
                                        paddingTop: 0.7,
                                    }}>
                                        Комментарии:
                                    </Grid> {/*TODO добавить возможность редактирования результата в течение часа*/}
                                    {testResult?.comment}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Grid>)}
        </Grid>
    )
}

export default DetailedTestInfo