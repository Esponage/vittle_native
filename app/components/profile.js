import React from 'react';
import BackboneMixin from '../mixins/backbone';
import store from '../store';
import update from 'react-addons-update';

const Profile = React.createClass({

  mixins: [BackboneMixin],

  getInitialState() {
    return {
      isEditing: false
    }
  },

  getModels() {
    var currentUser = store.getSession().currentUser;
    return {
      user: store.getUser(currentUser && currentUser.objectId)
    };
  },

  handleEdit() {
    this.setState({
      isEditing: !this.state.isEditing
    });
  },

  handleName(e) {
    this.setState({
      user: update(this.state.user, {
        name: {$set: e.target.value}
      })
    });
  },

  handleUploadPhoto(e) {
    e.preventDefault();
    filepicker.pick(
      (Blob) => {
        this.setState({
          user: update(this.state.user, {
            avatar: {$set: Blob}
          })
        });
      }
    );
  },

  handleSubmit(e) {
    e.preventDefault();
    store.saveUser(this.state.user);
    this.handleEdit();
  },

  render() {
    let user = this.state.user;

    if(this.state.isEditing) {
      return (
        <form onSubmit={this.handleSubmit}>
          <input value={user.name} onChange={this.handleName} />
          {user.avatar && <div><img src={user.avatar.url} alt="Profile picture" /></div>}
          <button onClick={this.handleUploadPhoto}>Upload Photo</button>
          <button type="submit">Save</button>
        </form>
      );
    } else {
      return (
        <div>
          <h1>{user.name}</h1>
          {user.avatar && <div><img src={user.avatar.url} alt="Profile picture" /></div>}
          <button onClick={this.handleEdit}>Edit</button>
        </div>
      );
    }
  }
});

export default Profile;
