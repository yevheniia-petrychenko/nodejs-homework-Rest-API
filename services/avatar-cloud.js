const fs = require('fs/promises');

class Upload {
  constructor(uploadCloud) {
    this.uploadCloud = uploadCloud;
  }

  async saveAvatarToCloud(pathFile, userIdImg) {
    const { public_id, secure_url } = await this.uploadCloud(pathFile, {
      public_id: userIdImg?.replace('/Photo', ''),
      folder: 'Photo',
      transformation: { width: 250, crop: 'pad' },
    });
    await this.deleteTemporaryAvatar(pathFile);
    return { userIdImg: public_id, avatarUrl: secure_url };
  }

  async deleteTemporaryAvatar(pathFile) {
    try {
      await fs.unlink(pathFile);
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = Upload;
