// documentService.js

const userModel = require('../userModel');
const DocumentModel = require('./documentModel'); // Assuming you have a document model defined

const generateSeriesNumber = async () => {
    try {
        const latestDocument = await DocumentModel.findOne({}, {}, { sort: { 'seriesNumber': -1 } });
        const latestSeriesNumber = latestDocument ? latestDocument.seriesNumber : 0;

        // Increment the latest series number
        const newSeriesNumber = latestSeriesNumber + 1;
        return newSeriesNumber.toString(); // Convert to string if needed
    } catch (error) {
        console.error(error);
        throw new Error('Error generating series number');
    }
};

// Helper function to generate a unique revenue number
const generateRevisionNumber = async () => {
    try {
        const latestDocument = await DocumentModel.findOne({}, {}, { sort: { 'revisionNumber': -1 } });
        const latestrevisionNumber = latestDocument ? latestDocument.revisionNumber : 0;

        // Increment the latest series number
        const newrevisionNumber = latestrevisionNumber + 1;
        return newrevisionNumber.toString(); // Convert to string if needed
    } catch (error) {
        console.error(error);
        throw new Error('Error generating revision number');
    }
};
const getDocument = async (originationSection) => {
    try {
        const document = await DocumentModel.find({ originationSection });
        if (document) {
            return { status: true, message: 'Document retrieved successfully', document };
        } else {
            return { status: false, message: 'Document not found' };
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching documents by department');
    }
};
// Function to get a document by ID
// const getDocument = async (documentId) => {
//     try {
//         const document = await DocumentModel.findById(documentId);

//         if (document) {
//             return { status: true, message: 'Document retrieved successfully', document };
//         } else {
//             return { status: false, message: 'Document not found' };
//         }
//     } catch (error) {
//         console.error(error);
//         return { status: false, message: 'Error retrieving document' };
//     }
// };

// Function to update a document by ID
const updateDocument = async (documentId, updatedDocumentDetails) => {
    try {
        const updatedDocument = await DocumentModel.findByIdAndUpdate(documentId, {
            $set: {
                fileName: updatedDocumentDetails.fileName,
                fileType: updatedDocumentDetails.fileType,
                link: updatedDocumentDetails.link,
                date: updatedDocumentDetails.date,
                department: updatedDocumentDetails.department,
                documentControllerName: updatedDocumentDetails.documentControllerName,
            },
        }, { new: true });

        if (updatedDocument) {
            return { status: true, message: 'Document updated successfully', document: updatedDocument };
        } else {
            return { status: false, message: 'Document not found' };
        }
    } catch (error) {
        console.error(error);
        return { status: false, message: 'Error updating document' };
    }
};

// Function to delete a document by ID
const deleteDocument = async (documentId) => {
    try {
        const deletedDocument = await DocumentModel.findByIdAndDelete(documentId);

        if (deletedDocument) {
            return { status: true, message: 'Document deleted successfully', document: deletedDocument };
        } else {
            return { status: false, message: 'Document not found' };
        }
    } catch (error) {
        console.error(error);
        return { status: false, message: 'Error deleting document' };
    }
};

module.exports = {
    createDocument: async (documentDetails) => {
        try {
            // Retrieve the user based on the department
            const user = await userModel.findOne({ department: documentDetails.originationSection });
            if (!user || !user.seriesNum) {
                throw new Error('User not found or seriesNum not defined');
            }

            // Generate the next series number
            const nextSeriesNum = `${documentDetails.originationSection}-${user.seriesNum.toString().padStart(4, '0')}`;

            // Determine the revision number based on the nature of the document
            let revisionNumber = 0;
            if (documentDetails.natureOfDocument === 'Revision') {
                // Find the highest revision number for the current series number
                const latestDocument = await DocumentModel.findOne({ seriesNumber: nextSeriesNum }).sort({ revisionNumber: -1 });
                if (latestDocument) {
                    revisionNumber = latestDocument.revisionNumber + 1;
                }
            } else if (documentDetails.natureOfDocument === 'Deletion') {
                // Find the highest revision number for the current series number
                const latestDocument = await DocumentModel.findOne({ seriesNumber: nextSeriesNum }).sort({ revisionNumber: -1 });
                if (latestDocument) {
                    revisionNumber = latestDocument.revisionNumber;
                }
            }

            // If the nature of the document is 'Addition', set revisionNumber to 0
            if (documentDetails.natureOfDocument === 'Addition') {
                revisionNumber = 0;
            }

            // Create the new document
            const newDocument = new DocumentModel({
                originationSection: documentDetails.originationSection,
                name: documentDetails.name,
                link: documentDetails.link,
                seriesNumber: nextSeriesNum,
                revisionNumber: revisionNumber,
                submittedBy: documentDetails.submittedBy,
                sourceDocument: documentDetails.sourceDocument,
                natureOfDocument: documentDetails.natureOfDocument,
            });

            // Save the new document
            const savedDocument = await newDocument.save();

            // Increment and update the series number in the user model
            user.seriesNum += 1;
            await user.save();

            return { status: true, message: 'Document created successfully', document: savedDocument };
        } catch (error) {
            console.error(error);
            return { status: false, message: 'Error creating document' };
        }
    },
    getDocument,
    updateDocument,
    deleteDocument,
};
