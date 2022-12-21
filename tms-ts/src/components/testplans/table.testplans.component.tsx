import React, {useEffect, useState} from "react";
import {
    Checkbox,
    FormControlLabel,
    Grid,
    Link,
    Table,
    TableBody,
    TableCell,
    TableRow, Typography
} from "@mui/material";
import BarChartComponent from "./bar.chart.component";
import {treeTestPlan} from "./testplans.component";
import TestPlanService from "../../services/testplan.service";
import {testPlan} from "../models.interfaces";


const TableTestPlans = (props: {
    testplan: treeTestPlan
}) => {
    const {testplan} = props;
    const [currentTestPlan, setCurrentTestPlan] = useState<testPlan>()
    const [selected, setSelected] = React.useState<number []>([]);

    useEffect(() => {
        if (!currentTestPlan) {
            TestPlanService.getTestPlan(testplan.id).then((response) => {
                setCurrentTestPlan(response.data)
            })
                .catch((e) => {
                    console.log(e);
                });
        }
    }, [currentTestPlan])

    // console.log(currentTestPlan)
    const getTestsResults = (currentTestPlan: testPlan | undefined) => {
        const testsResults: { passed: number, skipped: number, failed: number, blocked: number, untested: number, broken: number } = {
            passed: 0,
            skipped: 0,
            failed: 0,
            blocked: 0,
            untested: 0,
            broken: 0
        }
        if (currentTestPlan?.tests) {
            for (const cur_test of currentTestPlan?.tests) {
                // console.log(cur_test.current_result)
                if (typeof (cur_test.current_result) == "string") {
                    if (cur_test.current_result == "Passed") {
                        testsResults.passed++
                    }
                    if (cur_test.current_result == "Skipped") {
                        testsResults.skipped++
                    }
                    if (cur_test.current_result == "Failed") {
                        testsResults.failed++
                    }
                    if (cur_test.current_result == "Blocked") {
                        testsResults.blocked++
                    }
                    if (cur_test.current_result == "Untested") {
                        testsResults.untested++
                    }
                    if (cur_test.current_result == "Broken") {
                        testsResults.broken++
                    }
                }
                else if (!cur_test.current_result) {
                    testsResults.untested++
                }
            }
        }
        return testsResults
    }

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    return (
        <TableRow style={{paddingBottom: 0, paddingTop: 0, paddingRight: 0, marginRight: 0}}>
            <TableCell style={{paddingBottom: 3}}>
                <Table size="small">
                    {<TableBody style={{border: '1px solid'}}>
                        <TableRow>
                            <TableCell style={{width: "15%"}}>
                                <FormControlLabel
                                    label={testplan.id}
                                    control={<Checkbox
                                        style={{height: 20}}
                                        onClick={(event) => handleClick(event, testplan.id)}
                                        color="primary"
                                    />}
                                />
                            </TableCell>
                            <TableCell style={{width: "auto"}}>
                                <Grid>

                                    <Link href={"/testplans/" + testplan.id} underline="none"
                                          style={{display: 'flex', color: '#282828'}}>
                                        <Typography style={{paddingBottom: 2}}>
                                            {testplan.title}
                                        </Typography>
                                    </Link>

                                </Grid>
                                <Grid>
                                    {"Количество дочерних тест-планов: " + testplan.children.length + ". Количество тестов: " + currentTestPlan?.tests?.length}
                                </Grid>
                            </TableCell>
                            <TableCell align="right" style={{width: "25%"}}>
                                <BarChartComponent passed={getTestsResults(currentTestPlan).passed}
                                                   skipped={getTestsResults(currentTestPlan).skipped}
                                                   failed={getTestsResults(currentTestPlan).failed}
                                                   blocked={getTestsResults(currentTestPlan).blocked}
                                                   untested={getTestsResults(currentTestPlan).untested}
                                                   broken={getTestsResults(currentTestPlan).broken}/> {/*TODO*/}
                            </TableCell>
                        </TableRow>
                    </TableBody>}
                </Table>
            </TableCell>
        </TableRow>
    )
}

export default TableTestPlans