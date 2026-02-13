import type { RequestHandler } from 'express';
import { Post } from '#models';

const hasRole = (...roles: string[]): RequestHandler => {
  return async (req, _res, next) => {
    if (!req.user) throw new Error('Unauthorized', { cause: { status: 401 } });
    const { id } = req.params;
    const { roles: userRoles, id: userId } = req.user;
    let post: InstanceType<typeof Post> | null = null;

    if (id) {
      post = await Post.findById(id);

      if (!post) throw new Error('Post not found', { cause: { status: 404 } });

      req.post = post;
    }

    if (userRoles.includes('admin')) {
      return next();
    }

    if (roles.includes('self')) {
      if (post?.author.toString() !== userId) throw new Error('Forbidden', { cause: { status: 403 } });
    }

    next();
  };
};

export default hasRole;
