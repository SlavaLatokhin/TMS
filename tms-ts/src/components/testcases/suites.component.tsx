import {
    Button, Grid
} from "@material-ui/core";
import React, {useEffect, useMemo, useState} from "react";
import useStyles from "../../styles/styles";
import CreationCase from "./creation.case.component";
import CreationSuite from "./creation.suite.component";
import TableSuites from "./table.suites.component";
import SuiteCaseService from "../../services/suite.case.service";
import FolderSuites from "./folder.suites.component";
import {styled} from "@mui/material/styles";
import {Tooltip, tooltipClasses, TooltipProps} from "@mui/material";
import DetailedCaseInfo from "./detailed.case.info.component";
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';


export const CustomWidthTooltip = styled(({className, ...props}: TooltipProps) => (
    <Tooltip  {...props} classes={{popper: className}}/>
))(({theme}) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        marginLeft: 10,
        minWidth: 200,
        minHeight: 25,
        // backgroundColor: theme.palette.common.white,
        border: "1px solid #5c6900",
        color: "#4A4A4A",
        backgroundColor: '#fff4e5',
        fontSize: 15,
        textAlign: "start"
        // marginBottom: 10,
        // paddingBottom: 10
    },
    [`& .${tooltipClasses.arrow}`]: {
        "&:before": {
            border: "1px solid #5c6900",
            boxSizing: "border-box",
            backgroundColor: '#fff4e5'
            // borderTopWidth: 1,
        },
        fontSize: 25,
        // color: theme.palette.common.white
        // minWidth: 200,
        // minHeight: 25,
        // color: "red",
        // size: 100
    },
}));

export interface myCase {
    id: number;
    name: string;
    suite: number;
    scenario: string;
    project: number;
    estimate: number | null;
    teardown: string;
    setup: string;
    url?: string;
}

export interface treeSuite {
    id: number;
    level: number;
    name: string;
    children: treeSuite[];
    test_cases: myCase [];
}

export interface suite {
    id: number;
    name: string;
    parent: null | number;
    project: number;
    url: string;
}


const SuitesComponent: React.FC = () => {
    const [showCreationCase, setShowCreationCase] = useState(false)
    const [showCreationSuite, setShowCreationSuite] = useState(false)
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [suites, setSuites] = useState<suite []>([])
    const [treeSuites, setTreeSuites] = useState<treeSuite[]>([])
    // const [cases, setCases] = useState([])
    const [infoCaseForEdit, setInfoCaseForEdit] = useState<myCase | null>(null)
    const [lastEditCase, setLastEditCase] = useState<number>(-1)
    const [selectedSuiteCome, setSelectedSuiteCome] = useState<{ id: number, name: string } | null>(null)
    const [detailedCaseInfo, setDetailedCaseInfo] = useState<{ show: boolean, myCase: myCase }>({
        show: false, myCase: {
            id: -1,
            name: "",
            suite: -1,
            scenario: "",
            project: -1,
            setup: "",
            teardown: "",
            estimate: -1
        }
    })

    // const memoizedValue = useMemo(() => <TableSuites
    //     selected={selected} setSelected={setSelected}
    //     setShowCreationCase={setShowCreationCase}
    //     setShowCreationSuite={setShowCreationSuite}
    //     setSelectedSuiteCome={setSelectedSuiteCome}
    //     suites={suites}
    //     treeSuites={treeSuites}
    //     setInfoCaseForEdit={setInfoCaseForEdit}
    //     detailedCaseInfo={detailedCaseInfo}
    //     setDetailedCaseInfo={setDetailedCaseInfo}
    // />, [suites, treeSuites]);

    const memoizedValue2 = useMemo(() => <FolderSuites treeSuites={treeSuites} suites={suites}/>, [suites, treeSuites]);

    useEffect(() => {
        // SuiteCaseService.authorize().then((response) => {
        //     const token = response.data.access
        SuiteCaseService.getSuites().then((response) => {
            // const localSuites = response.data
            setSuites(response.data)
            console.log(response.data.length)
            // console.log(response.data)

            // console.log(response.data)
            // for (let i = 100; i< 600; i++){
            //     SuiteCaseService.deleteSuite(response.data[i].id).then((r)=> console.log(r))
            // }
            // SuiteCaseService.deleteCase(2000).then((r) => console.log(r)).catch((r) => console.log(r))
            // SuiteCaseService.getCases().then((response) => {
            // const localCases = response.data
            // console.log(response.data.length)
            // SuiteCaseService.getTreeSuites().then((response) => {
            //     // const localTreeSuites = response.data
            //     setTreeSuites(response.data)
            // })
            // })
        })
            // })
            .catch((e) => {
                console.log(e);
            });
        SuiteCaseService.getTreeSuites().then((response) => {
            setTreeSuites(response.data)
        })
    }, [])

    const handleShowCreationCase = () => {
        if (suites.length > 0) {
            setShowCreationCase(true)
            setSelectedSuiteCome({id: suites[0].id, name: suites[0].name})
        }
    }

    const handleShowCreationSuite = () => {
        setShowCreationSuite(true)
        setSelectedSuiteCome(null)
    }
    const classes = useStyles()
    return (
        <Grid style={{
            marginTop: 0,
            position: "absolute",
            display: "flex",
            height: "91.5%",
            width: "100%"
        }}>
            <Grid style={{
                overflowY: "auto", maxHeight: "100%", width: "80%"
            }}>
                <TableSuites selected={selected} setSelected={setSelected}
                             setShowCreationCase={setShowCreationCase}
                             setShowCreationSuite={setShowCreationSuite}
                             setSelectedSuiteCome={setSelectedSuiteCome}
                             suites={suites}
                             treeSuites={treeSuites}
                             setInfoCaseForEdit={setInfoCaseForEdit}
                             detailedCaseInfo={detailedCaseInfo}
                             setDetailedCaseInfo={setDetailedCaseInfo}
                             lastEditCase={lastEditCase}
                             setLastEditCase={setLastEditCase}
                             setTreeSuites={setTreeSuites}
                />
            </Grid>
            <Grid style={{
                backgroundColor: "#eeeeee",
                width: "20%"
            }}>
                <Grid style={{display: "flex", flexDirection: "column"}}>
                    <Grid style={{textAlign: "center"}}>
                        <Button style={{
                            margin: 15,
                            minWidth: "70%",
                            height: "45%",
                            backgroundColor: "#FFFFFF",
                            color: "#000000",
                        }} onClick={handleShowCreationCase}>Создать тест-кейс</Button>
                        <Button style={{
                            minWidth: "70%",
                            height: "45%",
                            backgroundColor: "#696969",
                            color: "#FFFFFF",
                        }} onClick={handleShowCreationSuite}>Создать сьюту</Button>
                        {suites.length > 0 &&
                        <CreationCase show={showCreationCase} setShow={setShowCreationCase} suites={suites}
                                      selectedSuiteCome={selectedSuiteCome} setTreeSuites={setTreeSuites}
                                      infoCaseForEdit={infoCaseForEdit}
                                      setInfoCaseForEdit={setInfoCaseForEdit}
                                      setDetailedCaseInfo={setDetailedCaseInfo}
                                      detailedCaseInfo={detailedCaseInfo}
                                      setLastEditCase={setLastEditCase}
                        />}
                        <CreationSuite show={showCreationSuite} setShow={setShowCreationSuite} suites={suites}
                                       setSuites={setSuites}
                                       selectedSuiteCome={selectedSuiteCome} setTreeSuites={setTreeSuites}/>
                    </Grid>
                </Grid>
                <Grid style={{
                    height: "67%"
                }}>
                    {memoizedValue2}
                </Grid>
            </Grid>
        </Grid>
    )
        ;
}

export default SuitesComponent
