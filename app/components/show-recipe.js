import React from 'react';
import store from '../store';
import { History } from 'react-router';
import BackboneMixin from '../mixins/backbone';
import RecipeForm from './recipe-form';

const ShowRecipe = React.createClass({
  mixins: [History, BackboneMixin],

  getInitialState() {
    return {
      isEditing: false
    };
  },

  componentWillMount() {
    store.fetchCommentsForRecipe(this.props.params.id);
  },

  getModels() {
    return {
      recipe: store.getRecipe(this.props.params.id),
      comments: store.getCommentsForRecipe(this.props.params.id)
    };
  },

  handleEdit() {
    this.setState({
      isEditing: !this.state.isEditing
    });
  },

  handleDestroy(e) {
    e.preventDefault();
    if(confirm("Are you sure?")){
      store.destroyRecipe(this.state.recipe).then(() => {
        this.history.replaceState(null, '/');
      });
    }
  },

  handleComment(e) {
    e.preventDefault();
    store.commentOnRecipe(this.props.params.id, this.refs.comment.value);
    this.refs.comment.value = '';
  },

  render() {
    let recipe = this.state.recipe;
    let comments = this.state.comments;

    if(this.state.isEditing) {
      return <RecipeForm initialRecipe={recipe} onSave={this.handleEdit} />;
    } else {
      return (
        <div>
          <h1>{recipe.name}</h1>
          <button onClick={this.handleEdit}>Edit</button>
          <button className="alert" onClick={this.handleDestroy}>Destroy</button>

          <form onSubmit={this.handleComment}>
            <input type="text" ref="comment" placeholder="Comment" />
          </form>

          <ul>
            {comments.map((c) => <li key={c.objectId}>{c.text}</li>)}
          </ul>
        </div>
      );
    }
  }
});

export default ShowRecipe;
