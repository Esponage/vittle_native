import React from 'react';
import store from '../store';
import { History } from 'react-router';
import BackboneMixin from '../mixins/backbone';
import update from 'react-addons-update';

const IngredientInput = React.createClass({

  propTypes: {
    name: React.PropTypes.string,
    qty: React.PropTypes.number,
    isNew: React.PropTypes.bool,
    onAdd: React.PropTypes.func
  },

  mixins: [BackboneMixin],

  handleAddIngredient(e) {
    e.preventDefault();
    this.props.onAdd({
      name: this.refs.name.value,
      qty: Number(this.refs.qty.value)
    });

    this.refs.name.value = '';
    this.refs.qty.value = '';
  },

  render() {
    return (
      <fieldset>
        <input type="text" placeholder="Ingredient" defaultValue={this.props.name} ref="name" />
        <input type="number" placeholder="Quantity" defaultValue={this.props.qty} ref="qty" />

        {this.props.isNew && <button onClick={this.handleAddIngredient}>+</button>}
      </fieldset>
    );
  }
});

const RecipeForm = React.createClass({
  propTypes: {
    params: React.PropTypes.object,
    initialRecipe: React.PropTypes.object,
    onSave: React.PropTypes.func
  },

  mixins: [History, BackboneMixin],

  getInitialState() {
    return {
      recipe: this.props.initialRecipe || {
        ingredients: []
      }
    };
  },

  handleChange(prop, e) {
    let newState = {};
    newState[prop] = {
      $set: e.target.value
    };

    this.setState({
      recipe: update(this.state.recipe, newState)
    });
  },

  handleSubmit(e) {
    e.preventDefault();

    let recipe = this.state.recipe;
    store.saveRecipe(recipe);

    // TODO: this isn't quite working, state is out of date
    if(this.props.onSave) {
      this.props.onSave(recipe);
    } else {
      this.history.pushState({}, '/');
    }
  },

  handleAddIngredient(ingredient) {
    this.setState({
      recipe: update(this.state.recipe, {
        ingredients: {$push: [ingredient]}
      })
    });
  },

  render() {
    let recipe = this.state.recipe;
    return (
        <form onSubmit={this.handleSubmit}>
          <fieldset>
            <input placeholder="Name" value={recipe.name} onChange={this.handleChange.bind(this, 'name')} />
            <input placeholder="Category" value={recipe.category} onChange={this.handleChange.bind(this, 'category')} />
          </fieldset>

          <fieldset>
            {recipe.ingredients.map((i, index) => {
              return <IngredientInput {...i} key={index} />;
            })}
            <IngredientInput isNew onAdd={this.handleAddIngredient} />
          </fieldset>

          <button type="submit">Save</button>
        </form>
    );
  }
});

export default RecipeForm;
