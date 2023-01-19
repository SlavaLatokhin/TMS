import React, {useEffect} from "react";
import {myCase} from "./suites.component";
import {Divider, Grid, IconButton, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Attachments from "../attachment/attachments";
import SuiteCaseService from "../../services/suite.case.service";
import {attachment} from "../models.interfaces";

interface Props {
    myCase: myCase;
    setDetailedCaseInfo: (data: { show: boolean, myCase: myCase }) => void
}

const DetailedCaseInfo: React.FC<Props> = ({myCase, setDetailedCaseInfo}) => {
    const [, setAttachments] = React.useState<attachment[]>()
    useEffect(() => {
        SuiteCaseService.getCaseById(myCase.id).then((response) => {
                myCase.attachments = response.data.attachments
                setAttachments(response.data.attachments)
            }
        )
    }, [myCase])

    return (
        <Grid style={{padding: 20, wordBreak: "break-word"}}>
            <Grid>
                <Grid style={{display: "flex", justifyContent: "space-between"}}>
                    <Typography variant="h6">
                        Название
                    </Typography>
                    <IconButton size={"small"} onClick={() => setDetailedCaseInfo({
                        show: false, myCase: {
                            id: -1,
                            name: "",
                            suite: -1,
                            scenario: "",
                            project: -1,
                            setup: "",
                            teardown: "",
                            estimate: -1,
                            attachments: []
                        }
                    })}>
                        <CloseIcon/>
                    </IconButton>
                </Grid>
                <Grid>
                    {myCase.name}
                </Grid>
                <Divider style={{margin: "10px 0px 10px 0px"}}/>
            </Grid>
            <Grid>
                <Typography variant="h6">
                    Описание
                </Typography>
                <Grid>
                    {myCase.scenario}
                </Grid>
                <Divider style={{margin: "10px 0px 10px 0px"}}/>
            </Grid>
            {myCase.setup && <Grid>
                <Typography variant="h6">
                    Подготовка теста
                </Typography>
                <Grid>
                    {myCase.setup}
                </Grid>
                <Divider style={{margin: "10px 0px 10px 0px"}}/>
            </Grid>}
            {myCase.teardown && <Grid>
                <Typography variant="h6">
                    Очистка после теста
                </Typography>
                <Grid>
                    {myCase.teardown}
                </Grid>
                <Divider style={{margin: "10px 0px 10px 0px"}}/>
            </Grid>}
            {myCase.estimate && <Grid>
                <Typography variant="h6">
                    Время выполнения
                </Typography>
                <Grid>
                    {myCase.estimate}
                </Grid>
                <Divider style={{margin: "10px 0px 10px 0px"}}/>
            </Grid>}
            {myCase.attachments && myCase.attachments?.length !== 0 && <Grid>
                <Typography variant="h6">
                    Прикрепленные файлы
                </Typography>
                <Grid>
                    <Attachments attachments={myCase.attachments}/>
                </Grid>
                <Divider style={{margin: "10px 0px 10px 0px"}}/>
            </Grid>}
        </Grid>
    )
}

export default DetailedCaseInfo