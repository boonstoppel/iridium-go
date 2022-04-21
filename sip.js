var sip = require('sip');
var crypto = require('crypto');
var digest = require('sip/digest');

var uri = 'sip:guest@192.168.0.1';
var aor = 'sip:guest@192.168.0.1'
var contact = 'sip:guest@192.168.0.1';

var user = 'guest';
var passwd = 'guest';
var hostname = '192.168.0.1';

sip.start({
    logger: {
        send: console.log,
        recv: function(e) {
            console.log('-------------------------------------------')
            console.log('----------- !!!! Recv !!!! ----------------')
            console.log('-------------------------------------------')
            console.log(e)
            console.log('-------------------------------------------')
        },
        error: function(e) {
            console.log('-------------------------------------------')
            console.log('----------- !!!! Error !!!! ---------------')
            console.log('-------------------------------------------')
            console.log(e)
            console.log('-------------------------------------------')
        }
    },
    hostname: hostname
}, function(rq) {
    // Minimal request handler
    sip.send(sip.makeResponse(rq, 405, 'Method Not Allowed'));
});

var seq = 1;
var from_tag = crypto.randomBytes(16).toString('hex');
var to_tag;
var callid = crypto.randomBytes(16).toString('hex');

var auth_context = null;

function on_successful_response(rs) {
  var expires = rs.headers.contact[0].params.expires || rs.headers.expires || 60;

  setTimeout(try_register, expires*1000);
}

function on_error_response(rs) {
  console.log('registration failure', rs);
  process.exit(-1);
}

var number_of_auth_tries = 0;

function on_authentication_response(rs) {
  var rq = {
    method: 'REGISTER',
    uri: uri,
    headers: {
      cseq: {method : "REGISTER", seq: seq++},
      to: {name: user, uri: aor},
      from: {name: user, uri: aor, params: {tag: from_tag}},
      'call-id': callid,
      contact: [{name: user, uri: contact}],
      expires: 60,
      Allow: 'PRACK, INVITE, ACK, BYE, CANCEL, UPDATE, INFO, SUBSCRIBE, NOTIFY, REFER, MESSAGE, OPTIONS',
      'max-forwards': 70,
      'content-length': 0,
      'user-agent': 'sip.js 0.2.41'
    }
  };

  if(to_tag) rq.headers.to.params = {tag: to_tag};
  auth_context = digest.signRequest(auth_context, rq, rs, {user: user, password: passwd});

  sip.send(rq, function(rs) {
    if(rs.status < 200)
      return;
    else if(rs.status < 300) {
      number_of_auth_tries = 0;
      on_successful_response(rs);
    }
    else if((rs.status === 401 || rs.status == 407) && number_of_auth_tries++ < 5) {
      on_authentication_response(rs);
    }
    else
      on_error_response(rs);
  });
}

function try_register() {
  var rq = {
    method: 'REGISTER',
    uri: uri,
    headers: {
      cseq: {method : "REGISTER", seq: seq++},
      to: {name: user, uri: aor},
      from: {name: user, uri: aor, params: {tag: from_tag}},
      'call-id': callid,
      contact: [{name: user, uri: contact }],
      expires: 60,
      Allow: 'PRACK, INVITE, ACK, BYE, CANCEL, UPDATE, INFO, SUBSCRIBE, NOTIFY, REFER, MESSAGE, OPTIONS',
      'max-forwards': 70,
      'content-length': 0,
      'user-agent': 'sip.js 0.2.41'
    }
  };

  if(to_tag) rq.headers.to.params = {tag: to_tag};

  if(auth_context) digest.signRequest(auth_context, rq);

  sip.send(rq, function(rs) {
    if(rs.headers.to.params && rs.headers.to.params.tag)
      to_tag = rs.headers.to.params.tag;

    if(rs.status < 200) return;

    if(rs.status <= 300)
      on_successful_response(rs);
    else if(rs.status === 401 || rs.status == 407)
      on_authentication_response(rs);
    else
      on_error_response(rs);
  });
}

try_register();
