const app = require('../app');
const db = require('../model/db');
const createFolderIfNotExcist = require('../helpers/create-dir');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const UPLOAD_DIR = process.env.UPLOAD_DIR;
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;

db.then(() => {
  app.listen(PORT, async () => {
    await createFolderIfNotExcist(UPLOAD_DIR);
    await createFolderIfNotExcist(AVATARS_OF_USERS);
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch((err) => {
  console.log(`Server is not running. Error ${err.message}`);
  process.exit(1);
});
