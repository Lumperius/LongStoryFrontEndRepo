import React from 'react';
import { connect } from 'react-redux';
import Wrapper from '../../objects';
import Typography from '@material-ui/core/Typography';


class SuccessOrder extends React.Component {
    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            }
        }
    }

    componentDidMount() {
    }

    render() {
        return (<Wrapper>
          {/* <Typography variant="h2" style={{textIndent: "40px", color: "darkblue"}}>Thank you!</Typography> */}
          <Typography variant="h4" style={{textIndent: "40px"}}>Your payment is accepted and your order will be delivered in span of 1 month or something.</Typography>
        </Wrapper>)
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(SuccessOrder)
