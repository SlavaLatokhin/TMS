import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Collapse,
    IconButton,
    Chip,
    tableCellClasses,
    Checkbox,
    Link,
    Box
} from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, {useEffect, useMemo, useState} from "react";
import useStyles from "../../styles/styles";
import {myCase, suite, treeSuite} from "./suites.component";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DetailedCaseInfo from "./detailed.case.info.component";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeletionDialogElement from "./deletion.dialog.element.component";
import DeletionDialogElements from "./deletion.dialog.elements.component";
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

// const tags = ['asdf', 'ОЧЕНЬ', "СРОЧНО", 'СРОЧНО', 'ОЧЕНЬ',
//     "СРОЧНО", 'СРОЧНО', 'ОЧЕНЬ', 'СРОЧНО', 'ОЧЕНЬ', "СРОЧНО", 'СРОЧНО', 'ОЧЕНЬ', "СРОЧНО", 'СРОЧНО', 'ОЧЕНЬ',
//     "СРОЧНО", 'СРОЧНО', 'ОЧЕНЬ', "СРОЧНО", 'СРОЧНО', 'ОЧЕНЬ', "СРОЧНО"];

// function CaseTagsField(props: { tags: any[] }) {
//     const {tags} = props
//     const classes = useStyles()
//     const [showMore, setShowMore] = React.useState(false);
//     const [showLink, setShowLink] = React.useState(false);
//     const gridTagsRef = useRef<any>(null);
//     useEffect(() => {
//         if (gridTagsRef.current && gridTagsRef.current.clientHeight < gridTagsRef.current.scrollHeight) {
//             setShowLink(true);
//         }
//     })
//
//     const onClickMore = () => {
//         setShowMore(!showMore);
//     }
//     return (
//         <Grid>
//             <Grid ref={gridTagsRef}
//                   className={showMore ? "" : classes.gridTags}
//             >
//                 {tags.map((tag, index) => (
//
//                     <Chip className={classes.chipTagsStatusInSuites} key={index}
//                           style={{
//                               margin: 5,
//                               borderRadius: 10,
//                               maxWidth: 300
//                           }} label={tag}/>
//
//                 ))
//                 }
//             </Grid>
//             <Grid style={{display: "flex", justifyContent: "left", marginLeft: 35}}>
//                 {(showLink && showMore && <Link component="button" onClick={() => onClickMore()}>
//                     Свернуть
//                 </Link>)
//                 ||
//                 (showLink && !showMore && <Link component="button" onClick={() => onClickMore()}>
//                     Развернуть
//                 </Link>)}
//             </Grid>
//         </Grid>
//     )
// }

// function CaseScenarioField(props: { scenario: string }) {
//     const {scenario} = props
//     const classes = useStyles()
//     const [showMore, setShowMore] = React.useState(false);
//     const [showLink, setShowLink] = React.useState(false);
//     const gridTagsRef = useRef<any>(null);
//     useEffect(() => {
//         if (gridTagsRef.current && gridTagsRef.current.clientHeight < gridTagsRef.current.scrollHeight) {
//             setShowLink(true);
//         }
//     })
//
//     const onClickMore = () => {
//         setShowMore(!showMore);
//     }
//     return (
//         <Grid>
//             <Grid ref={gridTagsRef}
//                   className={showMore ? "" : classes.gridScenario}
//             >
//                 {scenario}
//             </Grid>
//             <Grid style={{display: "flex", justifyContent: "left", marginLeft: 35}}>
//                 {(showLink && showMore && <Link component="button" onClick={() => onClickMore()}>
//                     Свернуть
//                 </Link>)
//                 ||
//                 (showLink && !showMore && <Link component="button" onClick={() => onClickMore()}>
//                     Развернуть
//                 </Link>)}
//             </Grid>
//         </Grid>
//     )
// }

function TableRowCase(props: {
    row: treeSuite, setShowCreationCase: (show: boolean) => void,
    setSelectedSuiteCome: (selectedSuite: { id: number, name: string } | null) => void,
    setDetailedCaseInfo: (myCase: { show: boolean, myCase: myCase }) => void,
    detailedCaseInfo: { show: boolean, myCase: myCase }, setInfoCaseForEdit: (myCase: myCase) => void,
    onecase: myCase,
    selected: number [], setSelected: (ids: number[]) => void,
    setTreeSuites: (treeSuites: treeSuite[]) => void,
    setOpenDialogDeletion: (show: boolean) => void,
    setComponentForDeletion: (component: { type: string, id: number }) => void
}) {
    const [visibleEditDeleteIcon, setVisibleEditDeleteIcon] = useState(false);
    const {
        row,
        setShowCreationCase,
        setSelectedSuiteCome,
        setDetailedCaseInfo,
        detailedCaseInfo,
        setInfoCaseForEdit,
        onecase,
        selected,
        setSelected,
        setTreeSuites,
        setOpenDialogDeletion,
        setComponentForDeletion
    } = props;
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
        <TableRow
            onMouseMove={() => setVisibleEditDeleteIcon(true)}
            onMouseLeave={() => setVisibleEditDeleteIcon(false)}
            hover
            selected={selected.indexOf(onecase.id) !== -1}
        >
            <TableCell>
                <Checkbox
                    style={{height: 25}}
                    onClick={(event) => handleClick(event, onecase.id)}
                    color="primary"
                    checked={selected.indexOf(onecase.id) !== -1}
                />
            </TableCell>
            <TableCell component="th"
                // id={`enhanced-table-checkbox-${index}`}
                       scope="row"
                       padding="none">
                {onecase.id}
            </TableCell>
            <TableCell style={{wordBreak: "break-word"}}>
                {onecase.name}
            </TableCell>
            <TableCell style={{textAlign: "end", display: "flex", justifyContent: "flex-end", minWidth: 60}}>
                {visibleEditDeleteIcon &&
                <Grid style={{textAlign: "end", display: "flex", justifyContent: "flex-end", width: 30}}>
                    <IconButton size={"small"} onClick={() => {
                        setComponentForDeletion({type: "case", id: onecase.id})
                        setOpenDialogDeletion(true)
                    }}>
                        <DeleteIcon fontSize={"small"}/>
                    </IconButton>
                    <IconButton size={"small"} onClick={() => {
                        setShowCreationCase(true)
                        setSelectedSuiteCome({id: row.id, name: row.name})
                        setInfoCaseForEdit(onecase)
                    }}>
                        <EditIcon fontSize={"small"}/>
                    </IconButton>
                </Grid>}
                <Grid id={onecase.id.toString() + "Arrow"}>
                    <IconButton size={"small"} onClick={() => {
                        // if (onecase.id == detailedCaseInfo.myCase.id) {
                        //     setDetailedCaseInfo({
                        //         show: !detailedCaseInfo.show,
                        //         myCase: onecase
                        //     })
                        // } else {
                        setDetailedCaseInfo({
                            show: true,
                            myCase: onecase
                        })
                        // }
                    }}>
                        <KeyboardArrowRightIcon
                            // id={onecase.id.toString() + "Arrow"}
                            //     sx={{
                            //     transform: (onecase.id == detailedCaseInfo.myCase.id && detailedCaseInfo.show) ? 'rotate(180deg)' : 'rotate(0deg)',
                            //     transition: '0.2s',
                            // }}
                        />
                    </IconButton>
                </Grid>
            </TableCell>
        </TableRow>)
}

function Row(props: {
    row: treeSuite, setShowCreationCase: (show: boolean) => void, setShowCreationSuite: (show: boolean) => void,
    setSelectedSuiteCome: (selectedSuite: { id: number, name: string } | null) => void, treeSuitesOpenMap: Map<number, boolean>,
    setTreeSuitesOpenMap: (newMap: (prev: Map<number, boolean>) => any) => void, setDetailedCaseInfo: (myCase: { show: boolean, myCase: myCase }) => void,
    detailedCaseInfo: { show: boolean, myCase: myCase }, setInfoCaseForEdit: (myCase: myCase) => void,
    setTreeSuites: (treeSuites: treeSuite[]) => void, selectedCases: number[], setSelectedCases: (cases: number[]) => void,
    setOpenDialogDeletion: (show: boolean) => void;
    setComponentForDeletion: (component: { type: string, id: number }) => void
}) {
    const {
        row,
        setShowCreationCase,
        setShowCreationSuite,
        setSelectedSuiteCome,
        treeSuitesOpenMap,
        setTreeSuitesOpenMap,
        setDetailedCaseInfo,
        detailedCaseInfo,
        setInfoCaseForEdit,
        setTreeSuites,
        selectedCases,
        setSelectedCases,
        setOpenDialogDeletion,
        setComponentForDeletion
    } = props;
    const [localOpen, setLocalOpen] = React.useState<boolean | undefined>(undefined);

    const checkIfAllSelected = () => {
        if (row.test_cases.length > 0) {
            for (let i = 0; i < row.test_cases.length; i++) {
                if (selectedCases.indexOf(row.test_cases[i].id) === -1) {
                    return false
                }
            }
            return true
        }
        return false
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        const caseIdsInCurrentRow = row.test_cases.map((onecase) => onecase.id)
        if (event.target.checked) {
            const newSelected = caseIdsInCurrentRow.filter((caseid) => selectedCases.indexOf(caseid) === -1)
            setSelectedCases(newSelected.concat(selectedCases))
            return;
        } else {
            const newSelected = selectedCases.filter((caseid) => caseIdsInCurrentRow.indexOf(caseid) === -1)
            setSelectedCases(newSelected)
        }
    };

    useEffect(() => {
        if (treeSuitesOpenMap.get(row.id) === undefined) {
            setTreeSuitesOpenMap(prev => (prev.set(row.id, true)))
            setLocalOpen(true)
        } else {
            setLocalOpen(treeSuitesOpenMap.get(row.id))
        }
    }, [treeSuitesOpenMap])

    const setOpenClose = () => {
        const flag = treeSuitesOpenMap.get(row.id)
        setTreeSuitesOpenMap(prev => (prev.set(row.id, !flag)))
        setLocalOpen(!flag)
    }

    return (
        <React.Fragment>
            <TableRow>
                <TableCell colSpan={4}>
                    <Grid sx={{display: "flex", flexDirection: "row", marginTop: 1, marginBottom: 0.32, maxWidth: 500}}
                          id={row.id.toString()}>
                        <Chip onClick={setOpenClose} icon={
                            <KeyboardArrowUpIcon sx={{
                                transform: localOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                                transition: '0.2s',
                            }}/>
                        }
                              style={{marginTop: 7}} label={row.name}/>
                        <IconButton size={"small"} onClick={() => {
                            setComponentForDeletion({type: "suite", id: row.id})
                            setOpenDialogDeletion(true)
                        }} style={{marginLeft: 2, marginTop: 7}}>
                            <DeleteIcon fontSize={"small"}/>
                        </IconButton>
                    </Grid>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 9, paddingRight: 0, marginRight: 10, minWidth: 300}}
                           colSpan={4}>
                    {(localOpen == true || localOpen == false) && <Collapse in={localOpen} mountOnEnter>
                        <Grid>
                            <Table size="small">
                                <TableBody style={{border: "solid", borderWidth: "1px 1px 1px 1px"}}>
                                    <TableRow style={{backgroundColor: "#eeeeee"}}>
                                        <TableCell style={{width: "5%"}}>
                                            <Checkbox
                                                style={{height: 20}}
                                                // indeterminate={selectedCases.length > 0 && selectedCases.length < row.test_cases.length}
                                                checked={checkIfAllSelected()}
                                                onChange={(e) => handleSelectAllClick(e)}
                                                color="primary"

                                            />
                                        </TableCell>
                                        <TableCell component="th"
                                                   scope="row"
                                                   padding="none" style={{width: "5%"}}>ID</TableCell>
                                        <TableCell style={{width: "auto"}} colSpan={2}>Название</TableCell>
                                        {/*<TableCell align={"center"} style={{width: "40%"}}>Описание</TableCell>*/}
                                        {/*<TableCell align={"center"} style={{width: "40%"}}>Время прохождения</TableCell>*/}
                                        {/*<TableCell align={"center"} style={{width: "40%"}}>Тэги</TableCell>*/}
                                        {/*<TableCell align={"center"} style={{width: "auto"}}>Статус</TableCell>*/}
                                    </TableRow>
                                </TableBody>
                                <TableBody style={{border: "solid", borderWidth: "0px 1px 1px 1px"}}>
                                    {row.test_cases.map((onecase, index) => (
                                        <TableRowCase key={onecase.id} onecase={onecase} row={row}
                                                      selected={selectedCases}
                                                      detailedCaseInfo={detailedCaseInfo}
                                                      setDetailedCaseInfo={setDetailedCaseInfo}
                                                      setInfoCaseForEdit={setInfoCaseForEdit}
                                                      setSelected={setSelectedCases}
                                                      setSelectedSuiteCome={setSelectedSuiteCome}
                                                      setShowCreationCase={setShowCreationCase}
                                                      setTreeSuites={setTreeSuites}
                                                      setOpenDialogDeletion={setOpenDialogDeletion}
                                                      setComponentForDeletion={setComponentForDeletion}
                                        />
                                    ))}
                                </TableBody>
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <Grid style={{display: "flex", flexDirection: "row"}}>
                                                <Link component="button" onClick={() => {
                                                    setShowCreationCase(true)
                                                    setSelectedSuiteCome({id: row.id, name: row.name})
                                                }}>
                                                    Добавить тест-кейс
                                                </Link>
                                                <Link underline="none">&nbsp;&nbsp;|&nbsp;&nbsp;</Link>
                                                <Link component="button"
                                                      onClick={() => {
                                                          setShowCreationSuite(true)
                                                          setSelectedSuiteCome({id: row.id, name: row.name})
                                                      }}>
                                                    Добавить сьюту
                                                </Link>
                                            </Grid>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                                {row && row.children &&
                                <TableBody sx={{borderLeft: "1px dashed", borderCollapse: "collapse"}}>
                                    {row.children.map((suite: any, index: number) => (
                                        <Row key={suite.id} row={suite}
                                             setShowCreationCase={setShowCreationCase}
                                             setShowCreationSuite={setShowCreationSuite}
                                             setSelectedSuiteCome={setSelectedSuiteCome}
                                             treeSuitesOpenMap={treeSuitesOpenMap}
                                             setTreeSuitesOpenMap={setTreeSuitesOpenMap}
                                             detailedCaseInfo={detailedCaseInfo}
                                             setDetailedCaseInfo={setDetailedCaseInfo}
                                             setInfoCaseForEdit={setInfoCaseForEdit}
                                             setTreeSuites={setTreeSuites}
                                             selectedCases={selectedCases}
                                             setSelectedCases={setSelectedCases}
                                             setOpenDialogDeletion={setOpenDialogDeletion}
                                             setComponentForDeletion={setComponentForDeletion}
                                        />
                                    ))}
                                </TableBody>

                                }
                            </Table>
                        </Grid>

                    </Collapse>}
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const TableSuites = (props: {
    selected: readonly string[], setSelected: (array: readonly string[]) => void,
    setShowCreationCase: (show: boolean) => void, setShowCreationSuite: (show: boolean) => void,
    treeSuites: treeSuite[], setSelectedSuiteCome: (selectedSuite: { id: number, name: string } | null) => void,
    suites: suite [], setInfoCaseForEdit: (myCase: myCase) => void,
    setDetailedCaseInfo: (myCase: { show: boolean, myCase: myCase }) => void,
    detailedCaseInfo: { show: boolean, myCase: myCase }, lastEditCase: number,
    setLastEditCase: (id: number) => void,
    setTreeSuites: (treeSuites: treeSuite[]) => void;
}) => {
    const classes = useStyles()
    const {
        setShowCreationCase,
        setShowCreationSuite,
        suites,
        setSelectedSuiteCome,
        treeSuites,
        setInfoCaseForEdit,
        setDetailedCaseInfo,
        detailedCaseInfo,
        lastEditCase,
        setLastEditCase,
        setTreeSuites
    } = props;
    const [treeSuitesOpenMap, setTreeSuitesOpenMap] = useState(new Map())
    const [shownCase, setShownCase] = useState<{ show: boolean, myCaseId: number }>({show: false, myCaseId: -1})
    const [selectedCases, setSelectedCases] = React.useState<number []>([]);
    const [openDialogDeletion, setOpenDialogDeletion] = useState(false);
    const [openDialogDeletionElements, setOpenDialogDeletionElements] = useState(false);
    const [componentForDeletion, setComponentForDeletion] = useState<{ type: string, id: number }>({type: "", id: -1})
    const [loading, setLoading] = useState(true)
    // const [detailedCaseInfo, setDetailedCaseInfo] = useState<{ show: boolean, myCase: myCase }>({
    //     show: false, myCase: {
    //         id: -1,
    //         name: "",
    //         suite: -1,
    //         scenario: "",
    //         project: -1,
    //         setup: "",
    //         teardown: "",
    //         estimate: -1
    //     }
    // })

    const openAll = () => {
        let newMap = new Map()
        suites.map((suite) => {
            newMap.set(suite.id, true)
        })
        setTreeSuitesOpenMap(newMap)
    }

    // useEffect(() => {
    //     return () => {
    //         setLoading(false)
    //     }
    // }, [])

    const closeAll = () => {
        let newMap = new Map()
        suites.map((suite) => {
            newMap.set(suite.id, false)
        })
        setTreeSuitesOpenMap(newMap)
    }
    const memoizedValue = useMemo(() => <Table size={"small"} sx={{
        [`& .${tableCellClasses.root}`]: {
            borderBottom: "none",
        }
    }}>
        <TableBody>
            {treeSuites.map((suite, index) => (
                <Row key={suite.id} row={suite}
                     setShowCreationCase={setShowCreationCase}
                     setShowCreationSuite={setShowCreationSuite}
                     setSelectedSuiteCome={setSelectedSuiteCome}
                     treeSuitesOpenMap={treeSuitesOpenMap}
                     setTreeSuitesOpenMap={setTreeSuitesOpenMap}
                     detailedCaseInfo={detailedCaseInfo}
                     setDetailedCaseInfo={setDetailedCaseInfo}
                     setInfoCaseForEdit={setInfoCaseForEdit}
                     setTreeSuites={setTreeSuites}
                     selectedCases={selectedCases}
                     setSelectedCases={setSelectedCases}
                     setOpenDialogDeletion={setOpenDialogDeletion}
                     setComponentForDeletion={setComponentForDeletion}
                />
            ))}
        </TableBody>
    </Table>, [suites, treeSuites, treeSuitesOpenMap, selectedCases]);

    useEffect(() => {
        if (detailedCaseInfo.show) {
            if (shownCase.show && detailedCaseInfo.myCase.id === shownCase.myCaseId && lastEditCase !== detailedCaseInfo.myCase.id) {
                document.getElementById(shownCase.myCaseId + "Arrow")!.style.transform = ""
                setDetailedCaseInfo({
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
                setShownCase({show: false, myCaseId: -1})
            } else if (lastEditCase !== detailedCaseInfo.myCase.id) {
                document.getElementById(detailedCaseInfo.myCase.id + "Arrow")!.style.transform = 'rotate(180deg)'
                if (shownCase.show) {
                    document.getElementById(shownCase.myCaseId + "Arrow")!.style.transform = ""
                }
                setShownCase({show: true, myCaseId: detailedCaseInfo.myCase.id})
            } else {
                setLastEditCase(-1)
            }
        } else if (detailedCaseInfo.myCase.id >= 0) {
            document.getElementById(detailedCaseInfo.myCase.id + "Arrow")!.style.transform = ""
            setDetailedCaseInfo({
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
            setShownCase({show: false, myCaseId: -1})
        }
    }, [detailedCaseInfo])
    console.log(selectedCases)
    return (

        <SplitterLayout customClassName={classes.splitter} primaryIndex={0} primaryMinSize={40} secondaryMinSize={35}
                        percentage>
            <Grid>
                <Box sx={{
                    boxShadow: 5,
                    display: "flex", flexDirection: "row", position: "sticky", top: 0,
                    backgroundColor: "white", border: "1px solid", zIndex: 1, height: 40
                }}>
                    <Grid style={{
                        margin: 5
                    }}>
                        <Link style={{maxHeight: "50%", marginLeft: 5}} component="button" onClick={() => {
                            openAll()
                        }}>
                            Раскрыть все
                        </Link>
                        <Link underline="none">&nbsp;&nbsp;|&nbsp;&nbsp;</Link>
                        <Link style={{maxHeight: "50%"}} component="button"
                              onClick={() => {
                                  closeAll()
                              }}>
                            Закрыть все
                        </Link>
                        <IconButton size={"small"} disabled={!(selectedCases.length > 0)} onClick={() => {
                            setOpenDialogDeletionElements(true)
                        }} style={{marginLeft: 5}}>
                            <DeleteIcon fontSize={"small"}/>
                        </IconButton>
                    </Grid>
                </Box>
                <Grid style={{padding: "0px 35px 20px 24px"}}>
                    {memoizedValue}
                </Grid>
                <DeletionDialogElement openDialogDeletion={openDialogDeletion}
                                       setOpenDialogDeletion={setOpenDialogDeletion}
                                       componentForDeletion={componentForDeletion}
                                       setTreeSuites={setTreeSuites}
                                       selectedForDeletion={selectedCases}
                                       setSelectedForDeletion={setSelectedCases}
                />
                <DeletionDialogElements openDialogDeletion={openDialogDeletionElements}
                                        setOpenDialogDeletion={setOpenDialogDeletionElements}
                                        selectedForDeletion={selectedCases}
                                        setTreeSuites={setTreeSuites}
                                        setSelectedForDeletion={setSelectedCases}
                />
            </Grid>
            {detailedCaseInfo.show &&
            <Grid>
                <DetailedCaseInfo myCase={detailedCaseInfo.myCase} setDetailedCaseInfo={setDetailedCaseInfo}/>
            </Grid>
            }
        </SplitterLayout>

    );
}
export default TableSuites