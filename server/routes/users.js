const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const PhoneToken = require('../models/phoneToken');

// Authorization Routes
router.post('/register', (req, res) => User.register(req.body, res.handle));

router.post('/register_phone/:id', (req, res) => PhoneToken.generate(req.params.id, res.handle));

router.route('/login')
.post((req, res) => User.authenticate(req.body, (err, tokenPkg) =>
res.status(err ? 400 : 200).send(err || { token: tokenPkg.token })));

router.post('/logout', (req, res) =>
res.clearCookie('accessToken').status(200).send({ SUCCESS: 'User has been Logged out.' }));

router.get('/verify/:token', (req, res) =>
User.emailVerify(req.params.token, err => {
  if (err) res.status(400).send(err);
  res.redirect('/#/login');
}));
router.get('/verify_phone/:token/:id', (req, res) =>
PhoneToken.verify(req.params.id, req.params.token, res.handle));

router.put('/:id/toggle_admin', User.authorize({ Admin: true }), (req, res) => {
  User.findById(req.params.id, (err, dbUser) => {
    if (err) res.status(400).send({ ERROR: 'Could not find a user by that id.' });
    dbUser.Admin = !dbUser.Admin;
    dbUser.save(res.handle);
  });
});

router.get('/profile', User.authorize(), (req, res) => res.send(req.user));

router.get('/populate', (req, res) => User.getAllPopulate(res.handle));
router.route('/:id')
.get((req, res) => User.getUser(req.params.id, res.handle))
.put((req, res) => {
  const userObj = {
    id: req.params.id,
    body: req.body,
  };
  User.updateUser(userObj, res.handle);
})
.delete((req, res) => User.removeUser(req.params.id, res.handle));
router.get('/', (req, res) => User.find({}, res.handle));

// Dev routes DELETE BEFORE DEPLOY
router.delete('/', (req, res) => User.remove({}, res.handle));
router.post('/:id/make_admin', (req, res) => {
  User.findById(req.params.id, (err, dbUser) => {
    dbUser.Admin = !dbuser.Admin;
    dbUser.save(res.handle);
  });
});

router.delete('/comments', (req, res) => {
  User.find({}, (err, dbUsers) => {
    dbUsers.forEach(dbUser => {
      dbUser.wComments = [];
      dbUser.rComments = [];
      dbUser.save(res.handle);
    });
  });
});
router.delete('/messages', (req, res) => {
  User.find({}, (err, dbUsers) => {
    dbUsers.forEach(dbUser => {
      dbUser.wMessages = [];
      dbUser.rMessages = [];
      dbUser.save(res.handle);
    });
  });
});

module.exports = router;
