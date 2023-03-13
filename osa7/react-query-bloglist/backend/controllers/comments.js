const router = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')

router.post('/:id/comments', async (request, response) => {
  const { content } = request.body
  const id = request.params.id
  const blog = await Blog.findById(id)
  const comment = new Comment({
    content,
    blog: id,
  })

  let createdComment = await comment.save()
  blog.comments = blog.comments.concat(createdComment._id)
  await blog.save()
  createdComment = await Comment.findById(createdComment._id).populate('blog')
  response.status(201).json(createdComment)
})

module.exports = router
