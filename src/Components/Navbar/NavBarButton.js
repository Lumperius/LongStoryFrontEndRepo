import React from 'react';
import styled from 'styled-components';

class TopBarButton extends React.Component
{

    NavBarButton = styled.a`
    text-decoration: none;
    display: block;
    color: white;
    text-align: center;
    padding: 18px 16px;
    `;

    render() {
        return(
            <this.NavBarButton href={this.props.linkInfo.link}>
                {this.props.linkInfo.text}
            </this.NavBarButton>
        );
    }
}

export default TopBarButton;