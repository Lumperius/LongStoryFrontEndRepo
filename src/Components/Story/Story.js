import React from 'react';
import styled from 'styled-components';
import axiosSetUp from '../../axiosConfig';
import AddStoryPart from './AddStoryPart'

class Story extends React.Component {

    constructor() {
        super();
        this.state = {
            showEditor: false,
            title: '',
            initialBody: '',
            StoryParts: []
        }
    }

    Wraper = styled.div`
    text-align:left;
    margin: 90px;
    font-size: 28px;
    `;
    SuggestNextPartButton = styled.button`
    
    `;

    componentDidMount() {
        this.sendGetStoryRequest();
    }

    sendGetStoryRequest() {
        let id = this.props.match.params.id;
        axiosSetUp().get(`http://localhost:5002/story/get?id=${id}`)
            .then(response => {
                this.setState({
                    title: response.data.title,
                    firstElementBody: response.data.firstElementBody,
                    StoryParts: response.data.storyParts
                })
            })
    }

    renderEditor = () => {
        if (this.state.showEditor) {
            let storyId = this.props.match.params.id;
            return <><AddStoryPart storyId={storyId}/></>
        }
        else return <this.SuggestNextPartButton onClick={
            () => this.setState({ showEditor: true })}>
            Add next </this.SuggestNextPartButton>
    }


    render() {
        return <this.Wraper>
            <h1>{this.state.title}</h1>
            <p>{this.state.initialBody}</p>
            {this.state.StoryParts.map((storyPart, index) => {
                return <>{this.state.StoryParts[index].body} </>
            })}
            {this.renderEditor()}
        </this.Wraper>
    }
}

export default Story;