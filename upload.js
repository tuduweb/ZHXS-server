const fs = require('fs')

var axios = require('axios');
var FormData = require('form-data');
var forms = new FormData();

forms.append('id', 1)
forms.append('segId', 2)
forms.append('file', fs.createReadStream("/home/hehao/2.wav"))

var config = {
  method: 'post',
  url: 'http://8.134.216.143:5000/upload',
  headers: forms.getHeaders(),
  data : forms
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
