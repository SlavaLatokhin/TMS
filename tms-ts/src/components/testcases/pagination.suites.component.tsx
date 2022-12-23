import {treeSuite} from "./suites.component";
import {Pagination} from "@mui/material";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import useStylesTestCases from "./styles.testcases"

function PaginationSuitesComponent(props: { treeSuites: treeSuite[] }) {
    const {treeSuites} = props;
    const countOfSuitesOnPage = 15;
    const [page, setPage] = useState(1);
    const classes = useStylesTestCases()
    const navigate = useNavigate()
    return (
        <div >
            <Pagination
                count={Math.ceil(treeSuites.length / countOfSuitesOnPage)}
                page={page}
                onChange={(_, num) => setPage(num)}
                sx={{marginY: 1, marginX: 1}}
            />
            {treeSuites.slice(page * countOfSuitesOnPage - countOfSuitesOnPage,
                page * countOfSuitesOnPage)
                .map((suite) => (
                    <div key={suite.id} className={classes.suitePaper} onClick={() => navigate(`${suite.id}`)}>
                        {suite.name}
                    </div>
                ))}
        </div>
    )
}

export default PaginationSuitesComponent