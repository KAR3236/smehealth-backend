import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomName } from './randomNumber.config';

export const storageConfig = {
  storage: diskStorage({
    destination: './upload',
    filename: (req, file, cb) => {
      const filename = `${randomName}${extname(file.originalname)}`;
      cb(null, filename);
    },
  }),
};
