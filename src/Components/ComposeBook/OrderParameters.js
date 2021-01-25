import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import renderMessage from '../../message';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormikTextField } from 'formik-material-fields';
import axiosSetUp from '../../axiosConfig';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


class OrderParameters extends React.Component {
    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            },
            format: 'Small',
            fontSize: 12
        }
    }

    ParametersSchema = Yup.object().shape({
        amount: Yup.number()
            .min(1, '1 book is a minimum for creating an order')
            .required('Required'),
        fontSize: Yup.number()
            .min(8)
            .max(20)
            .required('Required'),

    });


    Wraper = styled.div`
    text-align: left;
    margin: 10px;
    padding: 30px;
    font-size: 28px;
    border-style: solid;
    border-width: 1px;
    border-color: dark;
    background-color: white;
    `;
    SmallFormatPageExample = styled.div`
    border: solid 1px;
    word-break: break-all;
    padding: 30px;
    font-size: 13px;
    width: 12cm;
    height: 16.5cm;
    `;
    MediumFormatPageExample = styled.div`
    border: solid 1px;
    word-break: break-all;
    padding: 30px;
    font-size: 13px;
    width: 14cm;
    height: 20cm;
    `;
    LargeFormatPageExample = styled.div`
    border: solid 1px;
    word-break: break-all;
    padding: 30px;
    font-size: 15px;
    width: 17cm;
    height: 24cm;
    `;

    sendComposeBookRequest = (values) => {
        let MarkedStoryIdList = [];
        this.props.StoryList.map(story => {
            if (story?.isMarked) {
                MarkedStoryIdList.push(story.id);
            }
        })
        if (MarkedStoryIdList.length <= 0) {
            this.setState({
                message: {
                    body: 'You need to chose stories for the book first.',
                    type: 'error'
                }
            })
            return;
        }
        let body = {
            StoryIdList: MarkedStoryIdList,
            userId: this.props.token.id,
            amount: values.amount,
            format: this.state.format,
            fontSize: this.state.fontSize,
            title: this.state.title
        }
        axiosSetUp().post(`http://localhost:5002/story/collectStories`, body)
            .then(response => {
                this.setState({
                    message: {
                        body: 'Your request is sent',
                        type: 'success'
                    },
                })
            })
            .catch(error => {
                this.setState({
                    message: {
                        body: 'Error occured while proccessing the request. Try again later or contact the administrator.',
                        type: 'error'
                    }
                })
            })
    }

    handleFormatChange = (event) => {
        this.setState({
            format: event.target.value
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    computeSymbolsForPageExample = (pageSize) => {
        let randomText = '';
        for (let i = 0; i <= pageSize; i++) {
            randomText = randomText + 'a'
        }
        return randomText;
    }

    renderPagePreview = () => {
        switch (this.state.format) {
            case 'Small':
                return <this.SmallFormatPageExample>
                    <Typography variant="subtitle" style={{ position: "relative", top: "16cm", left: "10cm" }}>page 121</Typography>
                    <Typography variant="body1" style={{ fontSize: this.state.fontSize + "pt" }}>{this.computeSymbolsForPageExample(1200)}</Typography>
                </this.SmallFormatPageExample>
            case 'Medium':
                return <this.MediumFormatPageExample>
                    <Typography variant="subtitle" style={{ position: "relative", top: "19.5cm", left: "12cm" }}>page 121</Typography>
                    <Typography variant="body1" style={{ fontSize: this.state.fontSize + "pt" }}>{this.computeSymbolsForPageExample(1700)}</Typography>
                </this.MediumFormatPageExample>
            case 'Large':
                return <this.LargeFormatPageExample>
                    <Typography variant="subtitle" style={{ position: "relative", top: "23.5cm", left: "15cm" }}>page 121</Typography>
                    <Typography variant="body1" style={{ fontSize: this.state.fontSize + "pt" }}>{this.computeSymbolsForPageExample(2500)}</Typography>
                </this.LargeFormatPageExample>

        }
    }



    render() {
        return (<>
            <Formik
                initialValues={{
                    amount: 1,
                    fontSize: 12
                }}
                validationSchema={this.ParametersSchema}
                onSubmit={values => {
                    this.sendComposeBookRequest(values)
                }}
            >
                {({ errors, touched }) => (
                    <Form>
                        <FormikTextField label="Amount of books" name="amount" type="number" value={1} style={{ width: "10%" }} /><br />
                        <FormikTextField label="Font size" name="fontSize" type="number" value={12} onChange={this.handleChange} style={{ width: "10%" }} /><br />
                        <FormikTextField label="Title of the book" name="title" type="text" onChange={this.handleChange} style={{ width: "15%" }} /><br /><br />
                        <Select
                            style={{ width: "10%" }}
                            labelId="select"
                            id="select"
                            value={this.state.format}
                            onChange={this.handleFormatChange}
                        >
                            <MenuItem value={'Small'}>Small format</MenuItem>
                            <MenuItem value={'Medium'}>Medium format</MenuItem>
                            <MenuItem value={'Large'}>Large format</MenuItem>
                        </Select><br /><br />
                        {renderMessage(this.state.message.body, this.state.message.type)}
                        <Button variant="contained" color="primary" type="submit">Submit</Button><br />
                    </Form>
                )}
            </Formik><br />
            {this.renderPagePreview()}
        </>
        )
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(OrderParameters)
