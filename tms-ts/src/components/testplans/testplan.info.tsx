import {Grid} from "@material-ui/core";
import {
    Button,
    Checkbox,
    Chip,
    FormControlLabel,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from "@mui/material";
import moment from "moment";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React, {useState} from "react";
import useStyles from "../../styles/styles";
import {test, testPlan} from "../models.interfaces";
import EditIcon from "@mui/icons-material/Edit";

const TestplanInfo = (props: { currentTestPlan: testPlan, setShowCreationTestPlan: (show: boolean) => void, setIsForEdit: (isForEdit: testPlan) => void, detailedTestInfo: { show: boolean, test: test } | null, setDetailedTestInfo: (data: { show: boolean, test: test }) => void, showEnterResult: boolean, setShowEnterResult: (show: boolean) => void }) => {
    const {
        currentTestPlan,
        setShowCreationTestPlan,
        setIsForEdit,
        detailedTestInfo,
        setDetailedTestInfo,
        showEnterResult,
        setShowEnterResult,
    } = props;
    const classes = useStyles()

    const statuses: { id: number, name: string, color: string }[] = [{
        id: 1,
        name: 'Passed',
        color: '#24b124'
    }, {id: 2, name: 'Skipped', color: '#c4af30'}, {id: 0, name: 'Failed', color: '#bd2828'}, {
        id: 4,
        name: 'Blocked',
        color: '#6c6c6c'
    }, {id: 5, name: 'Untested', color: '#a5a4a4'}, {id: 3, name: "Broken", color: '#724127'}]

    function getCurrentResult(i: test) {
        const currentResult = i.test_results.find(x => x.id == Math.max(...i.test_results.map(el => el.id)));
        const curRes = statuses.find(x => x.id == currentResult?.status)
        return curRes ? curRes :
            {
                id: 5,
                name: 'Untested',
                color: '#a5a4a4'
            }
    }

    return (
        <Grid style={{paddingBottom: 20}}>
            <Grid style={{paddingBottom: 20}}>
                <Grid container style={{paddingBottom: 10}} spacing={2}>
                    <Grid item>
                        <Typography variant="h6" style={{padding: 0}}>
                            {currentTestPlan.title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton size={"small"} onClick={() => {
                            setShowCreationTestPlan(true)
                            setIsForEdit(currentTestPlan)
                        }}>
                            <EditIcon fontSize={"small"}/>
                        </IconButton>
                    </Grid>
                </Grid>
                <Typography>
                    {"Дата начала: " + moment(currentTestPlan.started_at, 'YYYY-MM-DDTHH:mm').format('MMMM D, YYYY HH:mm')}
                </Typography>
                <Typography>
                    {"Дата окончания: " + moment(currentTestPlan.due_date, 'YYYY-MM-DDTHH:mm').format('MMMM D, YYYY HH:mm')}
                </Typography>
            </Grid>
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        {currentTestPlan.tests.map((test, index) =>
                            (<TableRow key={index} className={classes.tableCellTests}>
                                    <TableCell className={classes.tableCellTests}>
                                        <FormControlLabel
                                            className={classes.checkboxTests}
                                            label={<Typography
                                                style={{fontSize: 15}}>{test.id}</Typography>}
                                            control={<Checkbox

                                                style={{height: 10}}
                                                color="primary"
                                            />}
                                        />
                                    </TableCell>
                                    <TableCell className={classes.tableCellTests}>
                                        {test.case.name}
                                    </TableCell>
                                    {test.test_results &&
                                    <TableCell className={classes.tableCellTests}>
                                        {/*<Button>*/}
                                        <Chip key={index} label={getCurrentResult(test).name}
                                              onClick={() => {
                                                  // if (!showEnterResult) {
                                                  setDetailedTestInfo({
                                                      show: true,
                                                      test: test
                                                  })
                                                  // }
                                                  test.id == detailedTestInfo?.test.id ? setShowEnterResult(!showEnterResult) : setShowEnterResult(true)

                                              }}
                                              style={{
                                                  margin: 3,
                                                  maxWidth: "95%",
                                                  backgroundColor: getCurrentResult(test).color,
                                                  color: "white"
                                              }}/>
                                        {/*</Button>*/}

                                    </TableCell>}
                                    {(!detailedTestInfo || !detailedTestInfo.show) &&
                                    (< TableCell className={classes.tableCellTests}>
                                        {moment(test.updated_at).format('DD/MM/YYYY')}
                                    </TableCell>)}
                                    {(!detailedTestInfo || !detailedTestInfo.show) &&
                                    (<TableCell className={classes.tableCellTests}>
                                        {test.user ? test.user : "Не назначен"}
                                    </TableCell>)}

                                    <TableCell className={classes.tableCellTests}>
                                        <IconButton size={"small"} onClick={() => {
                                            detailedTestInfo ?
                                                detailedTestInfo.test.id == test.id ?
                                                    setDetailedTestInfo({
                                                        show: !detailedTestInfo.show,
                                                        test: test
                                                    }) : setDetailedTestInfo({
                                                        show: true,
                                                        test: test
                                                    }) : setDetailedTestInfo({show: true, test: test})
                                        }}>
                                            <KeyboardArrowRightIcon sx={{
                                                transform: (test.id == detailedTestInfo?.test.id && detailedTestInfo?.show) ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: '0.2s',
                                            }}/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}

export default TestplanInfo