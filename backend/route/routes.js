var express = require('express');
var userController = require('../src/user/userController');
var documentController = require('../src/user/documents/documentController');

const router = express.Router();

// User routes
router.post('/src/user/login', userController.loginUserControllerFn);
router.post('/src/user/create', userController.createUserControllerFn);

// Document routes
router.post('/src/user/document/create', documentController.createDocumentControllerFn);
router.get('/src/user/document/:department', documentController.getDocumentControllerFn);
router.put('/src/user/document/:documentId', documentController.updateDocumentControllerFn);
router.delete('/src/user/document/:documentId', documentController.deleteDocumentControllerFn);


router.get('/src/user/document/data-summary/:documentId', documentController.getDocumentByIdControllerFn);


module.exports = router;
