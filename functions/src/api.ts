import * as admin from "firebase-admin";
import * as express from 'express';
import * as crypto from 'crypto';

const app = express();

app.get('user/:id', (req, res) => {
    const uid = req.params.id;
    admin.auth().getUser(uid).then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
        res.end(userRecord.toJSON());
        
      }).catch((error) => {
          console.log("Error fetching user ", uid)
       res.end(JSON.stringify({error: error}));
      });
  
  })

app.post('/user', (req, res) => {
    const password = crypto.randomBytes(24).toString('base64').slice(0, 24);
    const email = req.body.email;
    const displayName = req.body.displayName;

    if(email === undefined || displayName == undefined){
        console.log("Invalid Request")
        res.status(400).end("Invalid Request")
    } else {

    admin
    .auth()
    .createUser({
      email: email,
      emailVerified: false,
      //phoneNumber: '+11234567890',
      password: password,
      displayName: displayName,
      //photoURL: 'http://www.example.com/12345678/photo.png',
      disabled: false,
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully created new user:', userRecord.uid);
      res.status(201).end(JSON.stringify(userRecord));
    })
    .catch((error) => {
      console.log('Error creating new user:', error);
      res.status(500).end(JSON.stringify(error))
    });
}
});

app.put('/user/:id', (req, res) => {
    // update user
});

app.delete('user?:id', (req, res) => {
    // delete user
})

export default app;