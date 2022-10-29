import React from "react";
import useStyles from "../../styles/styles";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import BookIcon from '@mui/icons-material/Book';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {Card, Collapse, Link, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {KeyboardArrowDown} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";


const projects = [["Проект1", "Какая-то информация о проекте 1"], ["Проект2", "Какая-то информация о проекте 2"],
    ["Проект3", "Какая-то информация о проекте 3"], ["Проект4", "Какая-то информация о проекте 4"]]

const ProjectSelection: React.FC = () => {
    const classes = useStyles()
    const [expanded, setExpanded] = React.useState(false);
    const [projectName, setProjectName] = React.useState("");
    const [projectDescription, setProjectDescription] = React.useState("");

    const onChangeProjectName =
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setProjectName(e.target.value)
        };

    const onChangeProjectDescription =
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setProjectDescription(e.target.value)
        };

    return (
        <Container component="main" maxWidth="md">
            <div className={classes.divProjectSelectionPage}>
                <div className={classes.divProjectSelectionPageLine}>
                    <Typography variant="h6" style={{marginTop:5}}>
                        Проекты
                    </Typography>
                    <IconButton
                        onClick={() => setExpanded(!expanded)}
                    >
                        <AddCircleOutlineRoundedIcon
                            style={{
                                opacity: expanded ? 0 : 1,
                            }}
                        />
                        <KeyboardArrowDown
                            style={{
                                marginLeft: -24,
                                opacity: expanded ? 1 : 0,
                                transition: '0.2s',
                            }}
                        />
                    </IconButton>

                </div>
                <Collapse in={expanded} timeout="auto">
                    <Card elevation={3} style={{
                        borderRadius: 15,
                        marginBottom: 20,
                        marginTop: 10,
                        marginLeft: 5,
                        marginRight: 5
                    }}>
                        <div style={{
                            alignItems: 'center',
                            flexDirection: 'column',
                            display: 'flex',
                            paddingBottom: 20,
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginTop: 10,
                                width: 700
                            }}>
                                <Typography variant="h6"
                                            style={{marginTop: 25, width: 300}}>
                                    Название проекта
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    placeholder="Введите название проекта"
                                    required
                                    fullWidth
                                    id="projectName"
                                    name="projectName"
                                    autoComplete="on"
                                    autoFocus
                                    value={projectName}
                                    onChange={onChangeProjectName}
                                />
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginTop: 10,
                                width: 700
                            }}>
                                <Typography variant="h6"
                                            style={{marginTop: 25, width: 300}}>
                                    О проекте
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    placeholder="Введите описание проекта"
                                    multiline
                                    minRows={6}
                                    maxRows={12}
                                    required
                                    fullWidth
                                    id="projectDescription"
                                    name="projectDescription"
                                    autoComplete="on"
                                    autoFocus
                                    value={projectDescription}
                                    onChange={onChangeProjectDescription}
                                />
                            </div>
                            <div style={{
                                textAlign: 'right',
                                width: 700,
                                marginTop: 10,
                            }}>
                                <Button
                                    variant={'contained'}
                                    color={'secondary'}
                                    style={{marginRight: 5}}
                                >
                                    Сохранить
                                </Button>
                                <Button
                                    variant={'contained'}
                                    color={'secondary'}
                                >
                                    Отмена
                                </Button>
                            </div>
                        </div>

                    </Card>
                </Collapse>

                {projects.map(([name, info]) =>
                    <div className={classes.divProjectSelectionPageLine}>
                        <Link href="/project" underline="none" style={{display: 'flex', color: '#282828'}}>
                            <BookIcon style={{marginTop: 0, fontSize: 30}}/>
                            <Typography variant="h6" style={{marginLeft: 16}}>
                                {name}
                            </Typography>
                            <Typography variant="h6" style={{marginLeft: 200}}>
                                {info}
                            </Typography>
                        </Link>
                    </div>
                )}
            </div>
        </Container>
    )
}

export default ProjectSelection;
