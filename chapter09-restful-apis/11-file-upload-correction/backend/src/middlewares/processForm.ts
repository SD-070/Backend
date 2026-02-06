import type { RequestHandler } from 'express';
import formidable, { type Part } from 'formidable';

//10mb
const maxFileSize = 10 * 1024 * 1024;

const filter = ({ mimetype }: Part) => {
  return Boolean(mimetype && mimetype.includes('image'));
};

const processForm: RequestHandler = (req, res, next) => {
  const form = formidable({ filter, maxFileSize });
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    try {
      if (!files || !files.image)
        throw new Error('Please upload an image file', { cause: { status: 400 } });

      req.body = fields;
      req.file = files.image[0];
      // console.log(files.image[0]);

      next();
    } catch (error) {
      next(error);
    }
  });
};

export default processForm;
