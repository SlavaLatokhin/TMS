import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody, TableCell,
    TableContainer, TableRow
} from "@mui/material";
import {Chart} from "react-google-charts";
import Typography from "@mui/material/Typography";
import {Button} from "@material-ui/core";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Projects: React.FC = () => {
    const labels = ['НАЗВАНИЕ', 'ВСЕГО', 'PASSED', 'SKIPPED', 'FAILED', 'RETEST']
    const exampleData = ['Тест-план 1', '13', '10', '1', '0', '2']

    return (
        <div>
            <Grid sx={{display: 'flex', justifyContent: 'center'}}>
                <Chart
                    chartType="LineChart"
                    data={[["Тест-план", "Пройдено"], [20, 15], [8, 8]]}
                    height="400px"
                />
                <Chart
                    chartType="SteppedAreaChart"
                    data={[["Тест-план", "Пройдено"], [20, 15], [8, 8]]}
                    height="400px"
                />
            </Grid>
            <Paper sx={{display: 'flex', justifyContent: 'center', backgroundColor: "#858585"}}>
                <Stack>
                    <Typography color={"white"} fontWeight={700} fontSize={24} mb={'20px'}>
                        Активность проекта
                    </Typography>
                    <TableContainer component={Paper} sx={{mb: '20px'}}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    {labels.map((value) => (
                                        <TableCell>
                                            <Typography>{value}</Typography>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>27/10/22</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            {exampleData.map((value) => (
                                                <TableCell>
                                                    <Typography>{value}</Typography>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>

                </Stack>
                <Button variant="contained"
                        style={{maxHeight: '20px', fontWeight: 600, margin: '20px 20px 20px'}}>Моя активность</Button>
                <Button variant="contained"
                        style={{maxHeight: '20px', fontWeight: 600, margin: '20px 20px 20px'}}>Фильтр</Button>
            </Paper>

        </div>

    );
};

export default Projects;