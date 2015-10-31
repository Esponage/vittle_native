import $ from 'jquery';

$.ajaxSetup({
  beforeSend(xhr, options) {
    if(options.url.match(/api.parse.com/)) {
      xhr.setRequestHeader('X-Parse-Application-Id', 'xR0Bhh88xR6hkxv6q8p1YUJaJYBXQM3dA01XusCc');
      xhr.setRequestHeader('X-Parse-REST-API-Key', 'f0OGjDzDvjj4V4XFlayTeGV406RRlIo0a6APSEBI');
      if(localStorage.getItem('parse-session-token')) {
        xhr.setRequestHeader('X-Parse-Session-Token', localStorage.getItem('parse-session-token'));
      }
    }
  }
});
