import { Router } from 'express';
import { validateZod, authenticate } from '#middlewares';
import { createPost, deletePost, getAllPosts, getSinglePost, updatePost } from '#controllers';
import { postSchema } from '#schemas';

const postsRouter = Router();

postsRouter.route('/').get(getAllPosts).post(authenticate, validateZod(postSchema), createPost);

postsRouter
  .route('/:id')
  .get(getSinglePost)
  .put(authenticate, validateZod(postSchema), updatePost)
  .delete(authenticate, deletePost);

export default postsRouter;
