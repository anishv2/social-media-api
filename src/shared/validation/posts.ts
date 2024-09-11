import { object, string, custom, TypeOf } from 'zod';

const postSchema = object({
    body: object({
        // image:custom<File>((v) => v instanceof File, { message: 'Image is required' }),
        title: string({ required_error: 'Enter post title' })
          .min(2, { message: 'Title should be of minimum 2 characters' })
          .max(100, { message: 'Title should be of maximum 100 characters' }),
        content: string({ required_error: 'Enter post content' })
          .min(2, { message: 'Post should be of minimum 2 characters' }),
        tags: string({ required_error: 'Enter tags'})
          .min(2, { message: 'Tag should be of minimum 1 tag' }),
      })
})
    

type CreatePostType = TypeOf<typeof postSchema>;

export {
  postSchema,
  CreatePostType
}