import React from 'react'
import axiosSetUp from '../../../axiosConfig';
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import setAvatar from '../../../Actions/setAvatar.js';
import renderMessage from '../../../message';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormikTextField } from 'formik-material-fields';
import buildRequest from '../../../helpers';

const MAX_LOGIN_LENGTH = 16;
const MIN_LOGIN_LENGTH = 8;
const MAX_NAME_LENGTH = 32;

class Info extends React.Component {

    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            },
            showEditor: false,
            info: {},
            avatarPath: '',
            avatar: null
        }
    }

    SignupSchema = Yup.object().shape({
        login: Yup.string()
            .min(MIN_LOGIN_LENGTH, `This login is too short, ${MIN_LOGIN_LENGTH} symbols is minimum`)
            .max(MAX_LOGIN_LENGTH, `This login is too long, ${MAX_LOGIN_LENGTH} symbols maximum`),
        firstName: Yup.string()
            .min(1, 'Name must contain 1 symbol at least')
            .max(MAX_NAME_LENGTH, `Name can't be longer than ${MAX_NAME_LENGTH} symbols`),
        lastName: Yup.string()
            .min(1, 'Name must contain 1 symbol at least')
            .max(MAX_NAME_LENGTH, `Name can't be longer than ${MAX_NAME_LENGTH} symbols`),
        birthday: Yup.date().transform((value, originalValue) => {
            value = originalValue.toISOString;
            return value;
        })
    });



    componentDidMount() {
        if (this.props.token)
            this.sendGetUserInfoRequest();
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleImageLoadEvent = (result) => {
        this.setState({
            avatarPath: result
        });
    }

    handleImageChange = (event) => {
        this.setState({
            avatar: event.target.files[0]
        })
        const fr = new FileReader();
        fr.addEventListener('load', () => this.handleImageLoadEvent(fr.result), false);

        if (event.target.files[0]) {
            fr.readAsDataURL(event.target.files[0]);
        }

    }


    handleSubmit = (event) => {
        event.preventDefault();
        let formData = new FormData();
        if (this.state.avatar === null) {
            this.setState({
                message: {
                    body: 'You need to choose avatar first.',
                    type: 'error'
                }
            })
            return;
        }
        formData.append('avatar', this.state.avatar);
        formData.append('title', '');
        formData.append('content', '');
        const queryData = {
            userId: this.props.token.id
        }
        axiosSetUp().post(buildRequest('/userInfo/setAvatar', queryData), formData, {
            headers: {
                'content-type': 'multipart/form-data',
            }
        })
            .then(response => {
                this.setState({
                    message: {
                        body: 'New avatar saved.',
                        type: 'success'
                    }
                })
            })
            .catch(err => {
                this.setState({
                    message: {
                        body: 'Error occured while setting new avatar.',
                        type: 'error'
                    }
                })
            })
    };


    sendGetUserInfoRequest = () => {
        const queryData = {
            userId: this.props.token.id
        }
        axiosSetUp().get(buildRequest('/userInfo/get', queryData))
            .then(response => {
                this.setState({
                    info: response.data,
                    login: response.data.login,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName
                })
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Error occured while downloading user information',
                        type: 'error'
                    }
                })
            });
    }


    sendPostUserInfoRequest = (values) => {
        if (!values.login && !values.firstName &&
            !values.lastName && !values.birthday)
            return;

        let userId = this.props.token.id;
        let body = {
            userId: userId,
            login: values.login,
            firstName: values.firstName,
            lastName: values.lastName,
            birthDay: values.birthday
        }
        axiosSetUp().post(buildRequest('/userInfo/setInfo'), body)
            .then(response => {
                let state = this.state;
                if (values.login)
                    state.info.login = values.login;
                if (values.firstName)
                    state.info.firstName = values.firstName;
                if (values.lastName)
                    state.info.lastName = values.lastName;
                if (values.birthday)
                    state.info.birthDay = values.birthday
                state.message = {
                    body: response.data,
                    type: 'success'
                }
                this.setState(state)
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Error occured while updating entries',
                        type: 'error'
                    }
                })
            });
    }

    renderAvatarSelection = () => {
        if (this.state.avatar) {
            return <form onSubmit={this.handleSubmit}>
                <img src={this.state.avatarPath} width="40px" height="40px" alt="Not loaded" /><br />
                <TextField id="image" type="file" label="Change avatar" accept="image/png, image/jpeg" onChange={this.handleImageChange} /><br />
                <Button variant="contained" color="primary" type="submit" style={{ margin: "10px" }} on>Change avatar</Button>
            </form>
        }
        if (this.props.avatar) {
            return <form onSubmit={this.handleSubmit}>
                <Typography variant="subtitle1">CURRENT AVATAR</Typography>
                <img src={`data:image/jpeg;base64,${this.props.avatar}`} width="40px" height="40px" alt="Not loaded" /><br />
                <TextField id="image" type="file" label="Change avatar" accept="image/png, image/jpeg" onChange={this.handleImageChange} /><br />
            </form>
        }
    }

    render() {
        return (
            <>
                <Formik
                    initialValues={{
                        login: '',
                        firstName: '',
                        lastName: '',
                        birthDay: null
                    }}
                    validationSchema={this.SignupSchema}
                    onSubmit={values => {
                        this.sendPostUserInfoRequest(values)
                    }}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <Typography variant="subtitle1" >
                                LOGIN: {this.state.info.login}
                            </Typography>
                            <FormikTextField name="login" type="text" label="Change login" style={{ width: "20%" }} />
                            <br /><br />
                            <Typography variant="subtitle1">
                                EMAIL: {this.state.info.email}
                            </Typography>
                            <Typography variant="subtitle1">
                                ROLE: {this.state.info.role}
                            </Typography><br />
                            <Typography variant="subtitle1">
                                FIRST AND SECOND NAME: {this.state.info.firstName} {this.state.info.lastName}
                            </Typography>
                            <FormikTextField name="firstName" label="First name" type="text" style={{ width: "20%" }} />
                            <br />
                            <FormikTextField name="lastName" label="Last name" type="text" style={{ width: "20%" }} />
                            <br /><br />
                            <Typography variant="subtitle1">
                                BIRTHDAY: {this.state.info.birthDay}
                            </Typography>
                            <FormikTextField name="birthday" type="date" style={{ width: "10%" }} />
                            <br /><br />
                            <Typography variant="subtitle1">
                                REGISTERED: {this.state.info.dateRegistered}
                            </Typography>
                            {renderMessage(this.state.message.body, this.state.message.type)}
                            <Button variant="contained" color="primary" type="submit" style={{ margin: "10px" }}>Edit</Button><hr />
                        </Form>
                    )}
                </Formik>
                {this.renderAvatarSelection()}
            </>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setAvatar: avatar => dispatch(setAvatar(avatar))
    };
};

const mapStateToProps = state => {
    return {
        avatar: state.avatar.avatar || 'default',
        token: state.token.tokenObj
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Info)