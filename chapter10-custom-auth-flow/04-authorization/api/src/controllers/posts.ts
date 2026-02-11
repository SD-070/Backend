import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { Post } from '#models';

export const getAllPosts: RequestHandler = async (_req, res) => {
  const posts = await Post.find().lean();
  res.json(posts);
};

export const createPost: RequestHandler = async (req, res) => {
  const newPost = await Post.create(req.body);
  res.status(201).json(newPost);
};

export const getSinglePost: RequestHandler = async (req, res) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  const post = await Post.findById(id).lean();
  if (!post) throw new Error(`Post with id of ${id} doesn't exist`, { cause: 404 });
  res.send(post);
};

export const updatePost: RequestHandler = async (req, res) => {
  const {
    params: { id },
    body: { title, image, content, author },
    post
    // user
  } = req;

  // if (!user) throw new Error('Unauthorized, please sign in', { cause: { status: 401 } });
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });

  // const updatedPost = await Post.findById(id);

  if (!post) throw new Error(`Post with id of ${id} doesn't exist`, { cause: 404 });

  // if (user.id !== updatedPost.author.toString() && !user.roles.includes('admin'))
  //   throw new Error('Not authorized', { cause: { status: 403 } });

  post.title = title;
  post.image = image;
  post.content = content;
  post.author = author;

  await post.save();

  res.json(post);
};

export const deletePost: RequestHandler = async (req, res) => {
  const {
    params: { id },
    post
    // user
  } = req;
  // if (!user) throw new Error('Unauthorized, please sign in', { cause: { status: 401 } });
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });

  // const deletedPost = await Post.findById(id);

  if (!post) throw new Error(`Post with id of ${id} doesn't exist`, { cause: 404 });

  // if (user.id !== deletedPost.author.toString() && !user.roles.includes('admin'))
  //   throw new Error('Not authorized', { cause: { status: 403 } });

  await Post.findByIdAndDelete(id);
  res.json({ success: `Post with id of ${id} was deleted` });
};
