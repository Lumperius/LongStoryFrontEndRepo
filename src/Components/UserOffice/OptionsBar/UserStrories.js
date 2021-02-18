import React from 'react'
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import renderMessage from '../../../message';
import UserStoryParts from './Stories/UserStoryParts';
import FavoriteStories from './Stories/FavoriteStories';
import StoriesOfUser from './Stories/StoriesOfUser';
import history from '../../../history'


class UserStories extends React.Component {

    constructor() {
        super()
        this.state = {
            message: {
                body: '',
                type: ''
            },
            render: 'favorites',
            UserStoriesList: [],
            FavoriteStoriesList: [],
            StoryPartsList: [],
        }
    }


    componentDidMount() {
        if (this.props.token === undefined)
            history.push('authentication');
    }


    handleClick = (render) => {
        this.setState({ render: render })
    }

    renderList = () => {
        switch (this.state.render) {
            case 'favorites':
                return <FavoriteStories Stories={this.state.FavoriteStoriesList} />
            case 'stories':
                return <StoriesOfUser Stories={this.state.UserStoriesList} />
            default:
                return <UserStoryParts StoryParts={this.state.StoryPartsList} />
        }
    }

    renderButton = (type) => {
        let variant;
        if (type === this.state.render) variant = 'contained';
        else variant = 'outlined';

        return <Button variant={variant} onClick={() => this.handleClick(type)}>{type}</Button>
    }

    renderButtons = () => {
        return <>
            {this.renderButton('favorites')}
            {this.renderButton('stories')}
            {this.renderButton('story parts')}
        </>
    }


    render() {
        return (
            <>
                {renderMessage(this.state.message.body, this.state.message.type)}
                {this.renderButtons()}<br /><br />
                {this.renderList()}
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.token.tokenObj,
    };
}

export default connect(mapStateToProps)(UserStories)