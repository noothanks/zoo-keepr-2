const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');

//central hub for all routing functions
//employs central router to modules exported from animalRoutes.js
//this index module can be used to centralize other modules
router.use(animalRoutes);
router.use(require('./zookeeperRoutes'));

module.exports = router;