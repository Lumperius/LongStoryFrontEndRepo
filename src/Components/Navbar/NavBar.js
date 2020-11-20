import React, { Component } from 'react';
import NavBarButton from './NavBarButton';
import styled from 'styled-components';
import Service from '../../Services/Service';

class NavBar extends React.Component{

  constructor(){
    super();
  }
    NavBarListElement = styled.li`
      & a {
        &:hover {
            background-color: dimgray;
          }
      }
      display:inline;
      float: left;
    `;
    NavBarList = styled.ul`
      list-style-type: none;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #333;
    `;

    _service;

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
                         link: "Authentication",
                         text: "Login" 
                       }}/>
                  </this.NavBarListElement>
                  
                  <this.NavBarListElement>
                    <NavBarButton linkInfo = {{
                        link: "Registration",
                        text: "Register" 
               }}/>
                 </this.NavBarListElement>
               </this.NavBarList>
           </nav>
        )
    }
}

export default NavBar;