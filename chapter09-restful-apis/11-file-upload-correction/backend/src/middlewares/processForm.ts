import type { RequestHandler } from 'express';
import formidable, { type Part } from 'formidable';

//10mb
const maxFileSize = 10 * 1024 * 1024;

const filter = ({ mimetype }: Part) => {
  // keep only images
  if (!mimetype || !mimetype.includes('image'))
    throw new Error('Only images are allowed', { cause: { status: 400 } });
  return true;
};

const processForm: RequestHandler = (req, res, next) => {
  try {
    const form = formidable({ filter, maxFileSize });
    form.parse(req, (err, fields, files) => {
      console.log(err);
      if (err) {
        next(err);
        return;
      }

      if (!files || !files.image)
        throw new Error('Please upload a file', { cause: { status: 400 } });

      req.body = fields;
      req.file = files.image[0];
      // console.log(files.image[0]);

      next();
    });
  } catch (error) {
    next(error);
  }
};

export default processForm;
