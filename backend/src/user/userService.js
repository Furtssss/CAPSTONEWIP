var userModel = require('./userModel');
var key = '123456789trytryrtyr';
var encryptor = require('simple-encryptor')(key);

module.exports.createuserDBService = (userDetails) => {
   console.log("Received userDetails:", userDetails);

   return new Promise(function myFn(resolve, reject) {
       if (!userDetails || !userDetails.firstname || !userDetails.lastname || !userDetails.email || !userDetails.password || !userDetails.department || !userDetails.seriesNum || !userDetails.trackNum) {
           reject("Invalid user details");
           return;
       }

       var userModelData = new userModel({
           firstname: userDetails.firstname,
           lastname: userDetails.lastname,
           department: userDetails.department,
           email: userDetails.email,
           password: userDetails.password,
           seriesNum: userDetails.seriesNum,
           trackNum: userDetails.trackNum
       });

    
       var encrypted = encryptor.encrypt(userDetails.password);
       userModelData.password = encrypted;

       userModelData.save()
           .then(result => {
               // Update the series number for the user
               userModel.updateOne({ email: userDetails.email }, { seriesNum: userDetails.seriesNum })
                   .then(() => {
                       resolve("User created successfully");
                   })
                   .catch(error => {
                       reject("Error updating user's series number");
                   });
           })
           .catch(error => {
               reject("Error saving user to the database");
           });
   });
   
}




// userService.js

module.exports.loginuserDBService = (userDetails) => {
    return new Promise(function myFn(resolve, reject) {
        console.log('User details received:', userDetails);
        userModel.findOne({ department: userDetails.department })
            .then(result => {
                console.log('User from DB:', result);

                if (result) {
                    const seriesNum = result.seriesNum;
                    const trackNum = result.trackNum;
                    var decrypted = encryptor.decrypt(result.password);
                    console.log('Decrypted Password:', decrypted);

                    if (decrypted === userDetails.password) {
                        // Include the department and firstname in the response
                        console.log('User validation successful. FirstName:', result.firstname);
                        resolve({ status: true, message: 'User validated successfully', department: userDetails.department, seriesNum: seriesNum, trackNum: trackNum,firstname: result.firstname, lastname: result.lastname });
                    } else {
                        console.log('Original Password:', userDetails.password);
                        reject({ status: false, msg: "User validation failed. Password mismatch." });
                    }
                } else {
                    reject({ status: false, msg: "Invalid user details" });
                }
            })
            .catch(error => {
                console.error('Error fetching user from the database:', error);
                reject({ status: false, msg: "Error fetching user from the database" });
            });
    });
}








