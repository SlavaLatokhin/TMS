import {
    Grid, Paper, TableContainer, Table, TableBody,
    TableCell, TableRow, Collapse, IconButton, Chip, tableCellClasses, Checkbox
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React from "react";

function createSuite(
    name: string,
    cases: [{ name: string; tags: string; status: string }, { name: string; tags: string; status: string }],
    suites?: any
) {
    return {
        name,
        cases,
        suites,
    };
}

function Row(props: { row: ReturnType<typeof createSuite>, selected: readonly string[], setSelected: (array: readonly string[]) => void }) {
    const {row, selected, setSelected} = props;
    const [open, setOpen] = React.useState(false);
    // const [selected, setSelected] = React.useState<readonly string[]>([]);

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = row.cases.map((n) => n.name);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const isSelected = (name: string) => {
        return selected.indexOf(name) !== -1
    };
    console.log(selected)
    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
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
        <React.Fragment>
            <TableRow>
                <TableCell colSpan={4}>
                    <Grid sx={{display: "flex", flexDirection: "row"}}>
                        <IconButton
                            style={{marginLeft: 9}}
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        </IconButton>
                        <Chip style={{marginTop: 7}} label={row.name}/>

                    </Grid>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0, paddingRight: 0}} colSpan={4}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                            <Grid >
                                <Table size="small">
                                    <TableBody>
                                        <TableRow style={{backgroundColor: "#eeeeee", border: '1px solid'}}>
                                            <TableCell style={{width: "1%"}}>
                                                <Checkbox
                                                    indeterminate={selected.length > 0 && selected.length < row.cases.length}
                                                    checked={selected.length > 0 && selected.length === row.cases.length}
                                                    onChange={(e) => handleSelectAllClick(e)}
                                                    color="primary"

                                                />
                                            </TableCell>
                                            <TableCell component="th"
                                                // id={`enhanced-table-checkbox-${index}`}
                                                       scope="row"
                                                       padding="none">Название</TableCell>
                                            <TableCell>Тэги</TableCell>
                                            <TableCell>Статус</TableCell>
                                        </TableRow>
                                    </TableBody>

                                    <TableBody sx={{
                                        border: '1px solid',
                                    }}>
                                        {row.cases.map((onecase, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Checkbox
                                                        onClick={(event) => handleClick(event, onecase.name)}
                                                        color="primary"
                                                        checked={isSelected(onecase.name)}
                                                        // inputProps={{
                                                        //     'aria-labelledby': `enhanced-table-checkbox-${index}`,
                                                        // }}
                                                    />
                                                </TableCell>
                                                <TableCell component="th"
                                                    // id={`enhanced-table-checkbox-${index}`}
                                                           scope="row"
                                                           padding="none">
                                                    {onecase.name}
                                                </TableCell>
                                                <TableCell>{onecase.tags}</TableCell>
                                                <TableCell>{onecase.status}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>

                                    {row && row.suites &&
                                    <TableBody>
                                        {row.suites.map((suite: any, index: number) => (
                                            <Row key={index} row={suite} selected={selected} setSelected={setSelected}/>
                                        ))}
                                    </TableBody>}
                                </Table>
                                {/*</TableContainer>*/}
                            </Grid>

                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const TableSuites = (props: { selected: readonly string[], setSelected: (array: readonly string[]) => void }) => {
    const {selected, setSelected} = props;
    // const suiteChildChildChildChild = [createSuite('Уведомления на почту', [
    //     {
    //         name: 'Добавление пользователя',
    //         tags: 'СРОЧНО',
    //         status: 'UNTESTED',
    //     },
    //     {
    //         name: 'Удаление пользователя',
    //         tags: 'НЕ НАДО ЭТО ТЕСТИРОВАТЬ',
    //         status: 'RETEST',
    //     }
    // ],),]
    // const suiteChildChildChild = [createSuite('Уведомления на почту', [
    //     {
    //         name: 'Добавление пользователя',
    //         tags: 'СРОЧНО',
    //         status: 'UNTESTED',
    //     },
    //     {
    //         name: 'Удаление пользователя',
    //         tags: 'НЕ НАДО ЭТО ТЕСТИРОВАТЬ',
    //         status: 'RETEST',
    //     }
    // ],suiteChildChildChildChild,),]
    const suiteChildChild = [createSuite('Уведомления на почту', [
        {
            name: 'Добавление пользователя',
            tags: 'СРОЧНО',
            status: 'UNTESTED',
        },
        {
            name: 'Удаление пользователя',
            tags: 'НЕ НАДО ЭТО ТЕСТИРОВАТЬ',
            status: 'RETEST',
        }
    ],),]
    const suiteChild = [createSuite('Уведомления на почту', [
        {
            name: 'Добавление пользователя2',
            tags: 'СРОЧНО',
            status: 'UNTESTED',
        },
        {
            name: 'Удаление пользователя2',
            tags: 'НЕ НАДО ЭТО ТЕСТИРОВАТЬ',
            status: 'RETEST',
        }
    ], suiteChildChild),]
    const suites = [
            createSuite('Система уведомлений',
                [
                    {
                        name: 'Добавление пользователя3',
                        tags: 'СРОЧНО',
                        status: 'UNTESTED',
                    },
                    {
                        name: 'Удаление пользователя3',
                        tags: 'НЕ НАДО ЭТО ТЕСТИРОВАТЬ',
                        status: 'RETEST',
                    }
                ], suiteChild
            ),
            createSuite('Регистрация пользователя',
                [
                    {
                        name: 'Сохранение пользователя в БД',
                        tags: 'СРОЧНО',
                        status: 'UNTESTED',
                    },
                    {
                        name: 'Удаление пользователя из БД',
                        tags: 'НЕ НАДО ЭТО ТЕСТИРОВАТЬ',
                        status: 'RETEST',
                    }
                ], suiteChild
            ),
        ]
    ;
    return (
        <Grid>
            <TableContainer component={Paper} style={{maxWidth: "95%", margin: 30, padding: 20}}>
                <Table aria-label="collapsible table" sx={{
                    [`& .${tableCellClasses.root}`]: {
                        borderBottom: "none",

                    }
                }}>
                    <TableBody>
                        {suites.map((suite, index) => (
                            <Row key={index} row={suite} selected={selected} setSelected={setSelected}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
}
export default TableSuites