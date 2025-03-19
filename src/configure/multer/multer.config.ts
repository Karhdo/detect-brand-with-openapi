import * as path from 'path';
import { diskStorage } from 'multer';

export const multerConfig = (destination: string) => ({
  storage: diskStorage({
    destination,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext);
      cb(null, `${baseName}-${Date.now()}${ext}`);
    },
  }),
});
