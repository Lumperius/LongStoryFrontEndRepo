import React from 'react'
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../../message';
import { Formik, Form} from 'formik';
import * as Yup from 'yup';
import { FormikTextField } from 'formik-material-fields';
import Wrapper from '../../objects';
import buildQuery from '../../helpers'

const MIN_INPUT_LENGTH = 8;
const MAX_INPUT_LENGTH = 16;

class Registration extends React.Component {

    constructor() {
        super();
        this.state = {
            message: {
                body: '',
                type: ''
            },
        }
    }

    SignupSchema = Yup.object().shape({
        login: Yup.string()
            .min(MIN_INPUT_LENGTH, `This login is too short, ${MIN_INPUT_LENGTH} symbols is minimum`)
            .max(MAX_INPUT_LENGTH, `This login is too long, ${MAX_INPUT_LENGTH} symbols maximum`)
            .required('Required'),
        email: Yup.string()
            .email('Invalid email')
            .required('Required'),
        password: Yup.string()
            .min(MIN_INPUT_LENGTH, `This password is too short, ${MIN_INPUT_LENGTH} symbols is minimum`)
            .max(MAX_INPUT_LENGTH, `This password is too long, ${MAX_INPUT_LENGTH} symbols maximum`)
            .required('Required'),
        repeat_password: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required')
    });


    SubmitButton = styled.button`
    background-color: #333; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 20px;
    `;
    InputLabel = styled.h3`
    font-size: 18px;
    margin: 0px;
    `;
    RegistrationLink = styled.a`
    font-size: 15px;
    text-decoration: none;
    color: blue;
    `;
    Error = styled.span`
    color: red;
    font-size: 16px;
    font-weight: 450;
    margin: 0px;
    `;

    sendRequest = (values) => {
        axiosSetUp().post(buildQuery('/user/register'), values)
            .then(response => {
                if (response.status === 201)
                    this.props.history.push('/authentication');
                else
                    throw response
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: error.data || [],
                        type: 'error'
                    }
                })
                console.log(error);
            })

    };


    render() {
        return (
            <Wrapper>
                <Typography variant='h4' align='left' style={{ margin: "30px" }} gutterBottom >Registration</Typography >
                <Formik
                    initialValues={{
                        login: '',
                        email: '',
                        password: '',
                        repeat_password: ''
                    }}
                    validationSchema={this.SignupSchema}
                    onSubmit= {values => {
                        delete values.repeat_password;
                        this.sendRequest(values)}}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <FormikTextField label="Login" name="login" type="text" style={{width: "20%"}}/><br/>
                            <FormikTextField label="Email" name="email" type="email" style={{width: "20%"}}/> <br/>
                            <FormikTextField label="Password" name="password" type="password" style={{width: "20%"}}/><br/>
                            <FormikTextField label="Repeat password" name="repeat_password" type="password" style={{width: "20%"}}/><br/>

                            {renderMessage(this.state.message.body, this.state.message.type)}<br/>
                            <Button variant="contained" color="primary" type="submit">Submit</Button>
                        </Form>
                    )}
                </Formik>
                <this.RegistrationLink href="/authentication">Already have an account?</this.RegistrationLink>
            </Wrapper>
        );
    }
}

export default Registration
