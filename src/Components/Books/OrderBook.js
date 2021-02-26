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
import text from './ExampleOfText';
import Wrapper, { backendDomain } from '../../objects';
import buildRequest from '../../helpers';

class OrderBook extends React.Component {
    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            },
            format: 'Large',
            fontSize: 12,
            orderState: 'no order',
            orderId: '',
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


    SmallFormatPageExample = styled.div`
    border: solid 1px;
    word-wrap: break-word;
    padding: 30px;
    font-size: 11px;
    width: 12cm;
    height: 16.5cm;
    `;
    MediumFormatPageExample = styled.div`
    border: solid 1px;
    word-break: break-word;
    padding: 30px;
    font-size: 13px;
    width: 14cm;
    height: 20cm;
    `;
    LargeFormatPageExample = styled.div`
    border: solid 1px;
    display: block;
    word-break:  break-word;
    padding: 30px;
    font-size: 15px;
    width: 17cm;
    height: 24cm;
    `;

    componentDidMount() {
        if (!this.props.token)
            this.props.history.push('authentication');
    }


    sendOrderBookRequest = (values) => {
        let body = {
            bookId: this.props.match.params.bookId,
            userId: this.props.token.id,
            amount: values.amount,
            fontSize: values.fontSize,
            bookFormat: this.state.format
        }
        this.setState({
            orderState: 'sent'
        })
        axiosSetUp().post(buildRequest('/storyBook/createOrder'), body)
            .then(response => {
                this.setState({
                    message: {
                        body: 'The order is sent, a notification will appear on navbar when it\'s ready to payment.',
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

    handleFontSizeChange = (event) => {
        let fontValue = event.target.value;
        if (event.target.value < 8)
            fontValue = 8;
        if (fontValue > 20)
            fontValue = 20;
        this.setState({
            fontSize: fontValue
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }


    computeSymbolsForPageExample = () => {
        let bookFormatKrit = 0;
        const GENERAL_KRIT = 1780000;
        const FONT_SIZE_KRIT = 2.05;
        switch (this.state.format) {
            case 'Small':
                bookFormatKrit = 0.13;
                break;
            case 'Medium':
                bookFormatKrit = 0.19;
                break;
            case 'Large':
                bookFormatKrit = 0.275;
                break;
            default:
                bookFormatKrit = 0;
        }
        const pageSize = GENERAL_KRIT * bookFormatKrit / this.state.fontSize ** FONT_SIZE_KRIT;
        let computedText = text.substring(0, pageSize);
        while (!computedText.endsWith(' '))
            computedText = computedText.substring(0, computedText.length - 1)
        return computedText.substring(0, computedText.length - 1) + '...';
    }


    renderButton = () => {
        if (this.state.orderState !== 'sent')
            return <Button variant="contained" color="primary" type="submit">Create order</Button>
    }

    renderPagePreview = () => {
        switch (this.state.format) {
            case 'Small':
                return <this.SmallFormatPageExample>
                    <Typography variant="subtitle" style={{ position: "relative", top: "16cm", left: "10cm" }}>page 121</Typography>
                    <Typography variant="body1" style={{ fontSize: this.state.fontSize + "pt" }}>{this.computeSymbolsForPageExample()}</Typography>
                </this.SmallFormatPageExample>
            case 'Medium':
                return <this.MediumFormatPageExample>
                    <Typography variant="subtitle" style={{ position: "relative", top: "19.5cm", left: "12cm" }}>page 121</Typography>
                    <Typography variant="body1" style={{ fontSize: this.state.fontSize + "pt" }}>{this.computeSymbolsForPageExample()}</Typography>
                </this.MediumFormatPageExample>
            case 'Large':
                return <this.LargeFormatPageExample>
                    <Typography variant="subtitle" style={{ position: "relative", top: "23.5cm", left: "15cm" }}>page 121</Typography>
                    <Typography variant="body1" style={{ fontSize: this.state.fontSize + "pt" }}>{this.computeSymbolsForPageExample()}</Typography>
                </this.LargeFormatPageExample>
            default:
                return <>Error occured while loading page example. Try to reload page.</>
        }
    }

    render() {
        return (<Wrapper>
            <Formik
                style={{ display: "inline" }}
                initialValues={{
                    amount: 1,
                    fontSize: 12
                }}
                validationSchema={this.ParametersSchema}
                onSubmit={values => {
                    this.sendOrderBookRequest(values)
                }}
            >
                {({ errors, touched }) => (
                    <Form>
                        <FormikTextField label="Amount of books" name="amount" type="number" value={1} style={{ width: "10%" }} /><br />
                        <FormikTextField label="Font size" name="fontSize" type="number" value={12} onChange={this.handleFontSizeChange} style={{ width: "10%" }} /><br />
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
                        {this.renderButton()}
                        {renderMessage(this.state.message.body, this.state.message.type)}
                    </Form>
                )}
            </Formik><br />
            {this.renderPagePreview()}
        </Wrapper>
        )
    }
}

const mapStateToProps = function (state) {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(OrderBook)
