import React from 'react';
import store from '../store';
import { Link } from 'react-router';
import BackboneMixin from '../mixins/backbone';

var Index = React.createClass({

  mixins: [BackboneMixin],

  componentWillMount() {
    store.fetchRecipes();
  },

  getModels() {
    return {
      recipes: store.getRecipes()
    }
  },

  render() {
    var recipes = this.state.recipes;
    // TODO: creator username is flashing
    return (
      <div>
        <h1>Index</h1>
        <ul>
          {recipes.map((r) => {
            return (<li key={r.objectId || Date.now()}><Link to={`/recipes/${r.objectId}`}>{r.name} - ({r.creator.username})</Link></li>);
          })}
        </ul>
      </div>
    );
  }

});

export default Index;
