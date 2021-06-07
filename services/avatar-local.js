const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');
const createFolderIfNotExcist = require('../helpers/create-dir');

class Upload {
  constructor(AVATAR_OF_USERS) {
    this.AVATAR_OF_USERS = AVATAR_OF_USERS;
  }

  async transformAvatar(pathFile) {
    const file = await Jimp.read(pathFile);
    await file
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(pathFile);
  }

  async saveAvatarToStatic({ idUser, pathFile, name, oldFile }) {
    await this.transformAvatar(pathFile);
    const folderUserAvatar = path.join(this.AVATAR_OF_USERS, idUser);
    await createFolderIfNotExcist(folderUserAvatar);
    await fs.rename(pathFile, path.join(folderUserAvatar, name));
    await this.deleteOldAvatar(
      path.join(process.cwd(), this.AVATAR_OF_USERS, oldFile)
    );
    const avatarUrl = path.normalize(path.join(idUser, name));
    return avatarUrl;
  }

  async deleteOldAvatar(pathFile) {
    try {
      await fs.unlink(pathFile);
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = Upload;
