import { Router } from 'express';
import { validateZod, authenticate, hasRole } from '#middlewares';
import { createPost, deletePost, getAllPosts, getSinglePost, updatePost } from '#controllers';
import { postSchema } from '#schemas';

const postsRouter = Router();

postsRouter.route('/').get(getAllPosts).post(authenticate, hasRole('user'), validateZod(postSchema), createPost);

postsRouter
  .route('/:id')
  .get(getSinglePost)
  .put(authenticate, hasRole('self' /*admin*/), validateZod(postSchema), updatePost)
  .delete(authenticate, hasRole('self'), deletePost);

export default postsRouter;
