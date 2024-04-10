var documentService = require('./documentService');
const DocumentModel = require('./documentModel');

const createDocumentControllerFn = async (req, res) => {
    try {
        // Assuming you have a function in userService.js for creating user documents
        const result = await documentService.createDocument(req.body);  // Use req.body directly
        res.json(result); // You might want to send a JSON response with the result
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

const getDocumentControllerFn = async (req, res) => {
    try {
        const result = await documentService.getDocument(req.params.department);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};
const updateDocumentControllerFn = async (req, res) => {
    try {
        const result = await documentService.updateDocument(req.params.documentId, req.body);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};


const deleteDocumentControllerFn = async (req, res) => {
    try {
        const result = await documentService.deleteDocument(req.params.documentId);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

const getDocumentByIdControllerFn = async (req, res) => {
    const documentId = req.params.documentId;
  
    try {
      // Use Mongoose to find the document by ID
      const documentData = await DocumentModel.findById(documentId);
  
      if (documentData) {
        // If the document is found, send it as a JSON response
        res.json({ document: documentData });
      } else {
        // If the document is not found, send a 404 status code and an error message
        res.status(404).json({ error: 'Document not found' });
      }
    } catch (error) {
      // If an error occurs during the database query, handle it appropriately
      console.error('Error fetching document by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


module.exports = {createDocumentControllerFn, getDocumentControllerFn, updateDocumentControllerFn, deleteDocumentControllerFn, getDocumentByIdControllerFn};