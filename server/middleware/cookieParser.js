
const parseCookies = (req, res, next) => {
  // console.log('req',req.headers.cookie);
  if (req.headers.cookie) {
    if (req.headers.cookie.length === 1) {
          var arr = splitCookie.split('=');
    } else if (req.headers.cookie.length > 1) {
      var splitCookie = req.headers.cookie.split(';');
      var arr1 = splitCookie[0].split('=');
      var arr2 = splitCookie[1].split('=');
      var arr3 = splitCookie[2].split('=');
      var resultObject = {}

    }
    // console.log(arr);
    // console.log(splitCookie);
  }

  // console.log('this cooooooookie', req.cookies);
  //this logs header object with key: value pairs
  // console.log("reqsomething", req.headers.cookie);
  //   if (req.headers.cookie) {
  //     var splitCookie = [];
  //     splitCookie.push(req.headers.cookies.split(';'));
  //     console.log(splitCookie);

  // console.log('1234'.split(''));
  // var splitCookie = [];
  // splitCookie.push(req.headers.cookies.split(';'));
  // console.log(splitCookie);

};

module.exports = parseCookies;


// [ [ 'shortlyid=18ea4fb6ab3178092ce936c591ddbb90c99c9f66',
//     ' otherCookie=2a990382005bcc8b968f2b18f8f7ea490e990e78',
//     ' anotherCookie=8a864482005bcc8b968f2b18f8f7ea490e577b20' ] ]