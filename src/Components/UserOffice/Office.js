import React  from 'react'
import styled from 'styled-components';
import Info from './Panel/Info';
import UserStories from './Panel/UserStrories';
import Settings from './Panel/Settings';


class Office extends React.Component{

    constructor(){
        super()
        this.state = {   
      }
    }

  ListButton = styled.a`
    text-decoration: none;
    display: block;
    color: white;
    text-align: center;
    padding: 1px 1px;
    `;
  ListElement = styled.li`
    & a {
      &:hover {
          background-color: #888;
        }
    }
    display:inline;
    float: left;
    margin: 0;
    padding: 0;
  `;
  List = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0px;
    overflow: hidden;
    background-color: #777;
  `;


    render(){
        return(
                <this.List>
                    <this.ListElement>
                        <this.ListButton><Info /></this.ListButton>
                    </this.ListElement>
                    <this.ListElement>
                        <this.ListButton><UserStories /></this.ListButton>
                    </this.ListElement>
                    <this.ListElement>
                        <this.ListButton><Settings /></this.ListButton>
                    </this.ListElement>
                </this.List>
        )
    }
}

export default Office;