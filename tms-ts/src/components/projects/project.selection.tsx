import React, {useEffect} from "react";
import useStyles from "../../styles/styles";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import BookIcon from '@mui/icons-material/Book';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {ButtonBase, Collapse, Grid, Link} from "@mui/material";
import {KeyboardArrowDown} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import CreationProject from "./creation.project";
import ProjectService from "../../services/project.service";
import {useNavigate} from "react-router-dom";


export interface project {
    id: number;
    name: string;
    description: string;
}

const ProjectSelection: React.FC = () => {
    const navigate = useNavigate()
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [projects, setProjects] = React.useState<project[]>([]);

    useEffect(() => {
        ProjectService.getProjects().then((response) =>
            setProjects(response.data)
        )
            .catch((e) => console.log(e));
    }, []);

    const loginToProject = (project: project) => {
        localStorage.setItem("currentProject", JSON.stringify(project));
        navigate("/project")
    }

    return (
        <Container component="main" maxWidth="md">
            <div className={classes.divProjectSelectionPage}>
                <div className={classes.divProjectSelectionPageLine}>
                    <Typography variant="h6" style={{marginTop: 5}}>
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
                    <CreationProject setProjects={setProjects}/>
                </Collapse>

                {projects.map((project, index) =>
                    <div key={project.name} style={{
                        flexDirection: 'row',
                        display: 'flex',
                        marginTop: 10,
                        cursor: "pointer"
                    }}
                         onClick={() => loginToProject(project)}>
                        <BookIcon style={{marginTop: 0, fontSize: 30}}/>
                        <div style={{marginLeft: "3%", width: "10%"}}>
                            <Typography variant="h6">
                                {project.name}
                            </Typography>
                        </div>
                        <div style={{width: "77%", marginLeft: "5%", textAlign: "left"}}>
                            <Typography variant="h6">
                                {project.description}
                            </Typography>
                        </div>

                    </div>
                )}
            </div>
        </Container>
    );
}

export default ProjectSelection;
