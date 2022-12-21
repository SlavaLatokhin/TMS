import React, {useEffect, useState} from "react";
import {Button, Grid} from "@material-ui/core";
import TableTestPlans from "./table.testplans.component";
import SuiteCaseService from "../../services/suite.case.service";
import TestPlanService from "../../services/testplan.service";
import CreationTestPlan from "./creation.testplan";
import {
    Link,
    Table,
    TableBody, TableCell,
    tableCellClasses,
    TableContainer, TableRow,
} from "@mui/material";
import {treeSuite} from "../testcases/suites.component";
import {param, test, testPlan} from "../models.interfaces";
import TestplanInfo from "./testplan.info";
import SplitterLayout from "react-splitter-layout";
import useStyles from "../../styles/styles";
import DetailedTestInfo from "./detailed.test.info";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

export interface treeTestPlan {
    id: number,
    name: string,
    level: number,
    children: treeTestPlan[],
    title: string;
}

const bfs = (startTrees: treeTestPlan[], testPlanId: number) => {
    let q: treeTestPlan[] = new Array<treeTestPlan>();

    for (let tree of startTrees) {
        q.push(tree);
        if (tree.id == testPlanId)
            return tree;
    }

    while (q.length > 0) {
        const v = q.shift();
        if (v != undefined) {
            for (let child of v.children) {
                if (child.id == testPlanId)
                    return child;
                q.push(child);
            }
        }
    }
}

const TestplansComponent: React.FC = () => {
    const classes = useStyles()
    // const navigate = useNavigate();
    const [showCreationTestPlan, setShowCreationTestPlan] = useState(false)
    const [isForEdit, setIsForEdit] = useState<testPlan | null>(null)
    const [testPlans, setTestPlans] = useState<testPlan []>([])
    const [testPlansDict, setTestPlansDict] = useState<{ [id: number]: testPlan }>([])
    const [treeTestPlans, setTreeTestPlans] = useState<treeTestPlan[]>([])
    const [params, setParams] = useState<param [] | null>(null)
    const [treeSuites, setTreeSuites] = useState<treeSuite[]>([])
    const [currentTestPlan, setCurrentTestPlan] = useState<testPlan | undefined>()
    const [detailedTestInfo, setDetailedTestInfo] = useState<{ show: boolean, test: test } | null>(null)
    const [showEnterResult, setShowEnterResult] = useState(false)
    const testPlanId = window.location.pathname == "/testplans" ? null : Number(window.location.pathname.slice("/testplans/".length))
    const [breadcrumbs, setBreadcrumbs] = useState<{ name: string, link: string | number }[]>()
    const [flag, setFlag] = useState(true)


    const handleShowCreationTestPlan = () => setShowCreationTestPlan(true)

    useEffect(() => {
            TestPlanService.getAllTestPlans().then((response) => {
                setTestPlans(response.data)
                let dictionary: { [id: number]: testPlan } = Object.fromEntries(response.data.map((x: testPlan) => [x.id, x]));
                setTestPlansDict(dictionary);
                /*for (let i = 0; i< response.data.length; i++){
                    TestPlanService.deleteTestPlan(response.data[i].id).then((r)=> console.log(r))
                }*/
            })
                .catch((e) => {
                    console.log(e);
                });
            if (testPlanId) {
                TestPlanService.getTestPlan(testPlanId).then((response) => {
                    setCurrentTestPlan(response.data)
                })
                    .catch((e) => {
                        console.log(e);
                    });

                // setCurrentTestPlan(testPlansDict[testPlanId])
            }

            TestPlanService.getTreeTestPlans().then((response) => {
                const localTreeTestPlans = response.data;
                // console.log('in fun');

                if (testPlanId) {
                    const testTreeTestPlan = bfs(localTreeTestPlans, testPlanId);
                    if (testTreeTestPlan == undefined) {
                        setTreeTestPlans([]);
                    } else {
                        setTreeTestPlans(testTreeTestPlan.children);
                    }
                } else {
                    setTreeTestPlans(localTreeTestPlans);
                }
            })
                .catch((e) => {
                    console.log(e);
                });
            TestPlanService.getParameters().then((response) => {
                const localParams = response.data
                setParams(localParams)
            })
                .catch((e) => {
                    console.log(e);
                });
            SuiteCaseService.getTreeSuites().then((response) => {
                setTreeSuites(response.data)
            })
                .catch((e) => {
                    console.log(e);
                });
        }, []
    )

    useEffect(() => {
        if (currentTestPlan && flag && testPlans.length !== 0) {
            const newBreadcrumbs = []
            newBreadcrumbs.push({name: currentTestPlan.name, link: currentTestPlan.id})
            let plan = currentTestPlan.parent
            while (plan) {
                // const parent = testPlansDict[plan]
                const parent = testPlans.find(x => x.id === plan)
                console.log("while")
                console.log(parent)
                console.log(plan)
                console.log(testPlans)
                if (parent) {
                    console.log("if")
                    newBreadcrumbs.push({name: parent.name, link: parent.id})
                    plan = parent.parent
                }
            }
            newBreadcrumbs.push({name: "Тест-планы", link: ""})
            setBreadcrumbs(newBreadcrumbs.reverse())
            setFlag(false)
        }
    }, [currentTestPlan])

    return (
        <Grid container style={{
            marginTop: 0,
            position: "absolute",
            display: "flex",
            height: "91.5%",
            width: "100%"
        }}>
            <Grid style={{overflowY: "auto", maxHeight: "100%", width: "80%"}}>
                <Grid style={{justifyContent: "center", display: "flex"}}>
                    <SplitterLayout customClassName={classes.splitter} primaryIndex={0} primaryMinSize={40}
                                    secondaryMinSize={35}
                                    percentage>
                        <TableContainer style={{maxWidth: "91.5%", margin: 30, padding: 20}}>
                            <Table size="small" sx={{
                                [`& .${tableCellClasses.root}`]: {
                                    borderBottom: "none",
                                }
                            }}>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <Breadcrumbs aria-label="breadcrumb">
                                                {breadcrumbs?.map((breadcrumb, index) =>
                                                    index == breadcrumbs.length - 1 ?
                                                        (<Link
                                                            color="textPrimary"
                                                            href={"/testplans/" + breadcrumb.link}
                                                            // onClick= {() => navigate("/testplans/" + breadcrumb.link)}
                                                            aria-current="page"
                                                            key={index}
                                                        >
                                                            {breadcrumb.name}
                                                        </Link>) :
                                                        (<Link color="inherit" href={"/testplans/" + breadcrumb.link}
                                                               key={index}>
                                                            {breadcrumb.name}
                                                        </Link>)
                                                )}
                                            </Breadcrumbs>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            {currentTestPlan &&
                                            <TestplanInfo currentTestPlan={currentTestPlan}
                                                          setShowCreationTestPlan={setShowCreationTestPlan}
                                                          setIsForEdit={setIsForEdit}
                                                          detailedTestInfo={detailedTestInfo}
                                                          setDetailedTestInfo={setDetailedTestInfo}
                                                          showEnterResult={showEnterResult}
                                                          setShowEnterResult={setShowEnterResult}/>}
                                        </TableCell>
                                    </TableRow>
                                    {treeTestPlans.map((testPlan, index) =>
                                        <TableTestPlans key={index} testplan={testPlan}/>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {detailedTestInfo && detailedTestInfo.show &&
                        <Grid>
                            <DetailedTestInfo test={detailedTestInfo.test} setDetailedTestInfo={setDetailedTestInfo}
                                              showEnterResult={showEnterResult}
                                              setShowEnterResult={setShowEnterResult}/>
                        </Grid>}
                    </SplitterLayout>
                </Grid>

            </Grid>
            <Grid style={{
                backgroundColor: "#eeeeee",
                width: "20%"
            }}>
                <Grid style={{display: "flex", flexDirection: "column"}}>
                    <Grid style={{textAlign: "center",}}>
                        <Button style={{
                            margin: 15,
                            minWidth: "70%",
                            height: "45%",
                            backgroundColor: "#FFFFFF",
                            color: "#000000",
                        }} onClick={handleShowCreationTestPlan}>Создать тест-план</Button>
                        <CreationTestPlan show={showCreationTestPlan} setShow={setShowCreationTestPlan}
                                          testPlans={testPlans} params={params} treeSuites={treeSuites}
                                          isForEdit={isForEdit} setIsForEdit={setIsForEdit}/>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default TestplansComponent