import React, {ChangeEvent, useEffect, useState} from "react";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import {Button, Paper, Stack, Typography} from "@mui/material";
import {user} from "./models.interfaces";
import ProjectService from "../services/project.service";
import ProfileService from "../services/profile.service";
import TextField from "@material-ui/core/TextField";
import Settings from "./settings";

const Profile: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [isSettings, setIsSettings] = useState<boolean>(false)
    const [showPasswordChange, setShowPasswordChange] = useState(false)

    const [currentUser, setCurrentUser] = useState<user>()
    const [username, setUsername] = useState<string>("")
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>()
    const [email, setEmail] = useState<string>()

    const [newPassword, setNewPassword] = useState<string>("")
    const [repeatNewPassword, setRepeatNewPassword] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [repeatError, setRepeatError] = useState(false)
    const [repeatHelperText, setRepeatHelperText] = useState<string>("Пожалуйста, введите новый пароль повторно")
    const [message, setMessage] = useState<string>("")

    const currentUsername = localStorage.getItem('currentUsername')
    const currentPassword = localStorage.getItem('currentPassword')

    const handleChangeUsername = (event: ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)
    const handleChangeFirstName = (event: ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value)
    const handleChangeLastName = (event: ChangeEvent<HTMLInputElement>) => setLastName(event.target.value)
    const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)

    const handleChangeNewPassword = (event: ChangeEvent<HTMLInputElement>) => setNewPassword(event.target.value)
    const handleChangeRepeatNewPassword = (event: ChangeEvent<HTMLInputElement>) => setRepeatNewPassword(event.target.value)
    const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)

    const handleOnShowSettings = () => setIsSettings(true)
    const handleOnShowChangePassword = () => {
        setMessage("")
        setNewPassword("")
        setRepeatNewPassword("")
        setPassword("")
        setShowPasswordChange(true)
    }
    const handleOnHideChangePassword = () => {
        window.location.assign('/profile')
    }
    const handleOnSavePersonalData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (currentUser && currentPassword) {
            ProfileService.changeUser(currentUser?.id, {
                username: username,
                password: currentPassword,
                first_name: firstName,
                last_name: lastName,
                email: email
            }).then(() => setMessage("Изменения успешно сохранены")).catch(() => setMessage("Пожалйста проверьте введенные данные"))
        }
    }
    const handleOnSavePassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (newPassword !== repeatNewPassword) {
            setRepeatHelperText("Новый пароль не совпадает с указанным")
            setRepeatError(true)
            return;
        }
        setRepeatHelperText("")
        setRepeatError(false)
        if (password !== currentPassword) {
            setMessage("Пожалуйста, введите корректно текущий пароль")
            return;
        }
        if (currentUser && currentUsername) {
            setMessage("")
            ProfileService.changeUser(currentUser?.id, {
                username: currentUsername,
                password: newPassword,
            }).then(() => setMessage("Изменения успешно сохранены")).catch(() => setMessage("Пожалйста проверьте введенные данные"))
        }
    }

    useEffect(() => {
        ProjectService.getUsers().then((response) => {
            const users: user[] = response.data
            const user: user | undefined = users.find((user) => user.username === currentUsername)
            setCurrentUser(user)
            setIsLoaded(true)
            setUsername(user?.username ?? username)
            setFirstName(user?.first_name ?? firstName)
            setLastName(user?.last_name ?? lastName)
            setEmail(user?.email ?? email)
        })
            .catch((e) => {
                console.log(e);
            });
    }, [])

    if (isLoaded) {
        if (isSettings) {
            return <Settings/>
        }
        return <>
            <Typography textAlign={"center"} mt={'15px'}>
                {message}
            </Typography>
            <Paper style={{
                padding: '10px 10px 10px 10px',
                display: 'flex',
                flexDirection: 'column',
                margin: '15px auto auto auto',
                width: '50%',
                alignItems: 'center'
            }}>
                {showPasswordChange ?
                    <>
                        <Button style={{alignSelf: "end"}} onClick={handleOnShowSettings}>
                            <SettingsIcon/>
                        </Button>
                        <Stack direction={"row"}>
                            <Button style={{margin: '10px 10px 10px 10px'}} onClick={handleOnHideChangePassword}>
                                <AccountBoxIcon fontSize={'large'}/>
                            </Button>
                        </Stack>
                        <form onSubmit={handleOnSavePassword}
                              style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                            <TextField variant={"outlined"} required label={'Новый пароль'}
                                       style={{margin: '10px 10px 10px 10px'}}
                                       type={"password"}
                                       value={newPassword}
                                       onChange={handleChangeNewPassword}/>
                            <TextField variant={"outlined"} required error={repeatError} label={'Подтверждение пароля'}
                                       style={{margin: '10px 10px 10px 10px'}}
                                       type={"password"} value={repeatNewPassword}
                                       onChange={handleChangeRepeatNewPassword}
                                       helperText={repeatHelperText}/>
                            <TextField variant={"outlined"} required type={"password"} label={'Текущий пароль'}
                                       style={{margin: '10px 10px 10px 10px'}}
                                       value={password} onChange={handleChangePassword}/>

                            <Button type={"submit"} variant={"contained"}
                                    sx={{margin: '10px 10px 10px 10px'}}>Сохранить</Button>
                        </form>
                    </>
                    :
                    <>
                        <Button style={{alignSelf: "end"}} onClick={handleOnShowSettings}>
                            <SettingsIcon/>
                        </Button>
                        <Stack direction={"row"}>
                            <AccountBoxIcon fontSize={'large'} sx={{margin: '10px 10px 10px 10px'}}/>
                            <Button variant={"outlined"}
                                    sx={{margin: '10px 10px 10px 10px'}} onClick={handleOnShowChangePassword}>Сменить
                                пароль</Button>

                        </Stack>
                        <form onSubmit={handleOnSavePersonalData}
                              style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                            <TextField variant={"outlined"} required label={'Имя пользователя'}
                                       style={{margin: '10px 10px 10px 10px'}}
                                       value={username} onChange={handleChangeUsername}/>
                            <TextField variant={"outlined"} label={'Имя'} style={{margin: '10px 10px 10px 10px'}}
                                       value={firstName}
                                       onChange={handleChangeFirstName}/>
                            <TextField variant={"outlined"} label={'Фамилия'} style={{margin: '10px 10px 10px 10px'}}
                                       value={lastName}
                                       onChange={handleChangeLastName}/>
                            <TextField variant={"outlined"} label={'Адрес электронной почты'}
                                       style={{margin: '10px 10px 10px 10px'}}
                                       value={email} onChange={handleChangeEmail}/>

                            <Button type={"submit"} variant={"contained"}
                                    sx={{margin: '10px 10px 10px 10px'}}>Сохранить</Button>
                        </form>
                    </>
                }

            </Paper></>
    } else
        return <></>
}

export default Profile