import React from 'react';
import NavBarButton from './NavBarButton';
import styled from 'styled-components';
import Logout from '../Logout/Logout';
import { connect } from 'react-redux';

class AuthorizedNavBar extends React.Component{

  NavBarListElement = styled.li`
      background-color: #3f51b5;
  
      & a {
        &:hover {
            background-color: lightblue;
          }
      }
      display:inline;
      float: left;
    `;    
  LogoutElement = styled.li`
    & div {
      &:hover {
          background-color: lightblue;
          cursor: pointer;
        }
    }
    display:inline;
    float: right;
  `;    
  NavBarList = styled.ul`
      list-style-type: none;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #3f51b5;
    `;


    adminElement = () => {
      if(this.props.token.scope === "Admin"){
              return(                  
        <this.NavBarListElement>
        <NavBarButton linkInfo = {{
          link: "Admin",
          text: "Admin Page" 
        }}/>                  
           </this.NavBarListElement>
      )
      }
    }

    render(){
        return(
                <nav>
                    <this.NavBarList>
                        <this.NavBarListElement>
                    <NavBarButton linkInfo = {{
                      link: "/",
                      text: "LongStory" 
                    }}/>
                       </this.NavBarListElement>

                       <this.NavBarListElement>
                    <NavBarButton linkInfo = {{
                      link: "Office",
                      text: "Your office" 
                    }}/>                  
                       </this.NavBarListElement>
                      
                      {this.adminElement()}

                      <this.NavBarListElement>
                    <NavBarButton linkInfo = {{
                      link: "IntializeStory",
                      text: "Start a story" 
                    }}/>                  
                       </this.NavBarListElement>

                       <this.LogoutElement>
                    <Logout />
                       </this.LogoutElement>
                    </this.NavBarList>
                </nav>
        )
    }
}

const mapStateToProps = state => {
  return {
    token: state.token.tokenObj
  }
}

export default connect(mapStateToProps)(AuthorizedNavBar)