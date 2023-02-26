import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import Blog from './Blog'

describe('<Blog />', () => {

  const mockHandler = jest.fn()

  const user = {
    id: 'testId123456',
    name: 'tester TheMan',
    username: 'testerMaster'
  }

  const blog = {
    id: 'testId2468',
    title: 'Twitter blog',
    author: 'Twitter Inc',
    url: 'https://blog.twitter.com/',
    user: 'testId123456'
  }

  beforeEach(() => {
    render(<Blog key={blog.id} blog={blog} handleLike={mockHandler}/>)
  })

  test('by default renders only author and title', () => {
    
    let element = screen.queryByText('Twitter blog')
    expect(element).toBeDefined()

    screen.getByText('Twitter blog Twitter Inc')
    element = screen.queryByText('https://blog.twitter.com/')
    expect(element).toBeNull()
  })

  test('renders url, likes and user when button is pressed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    let element = screen.queryByText('https://blog.twitter.com/')
    expect(element).toBeDefined()

    element = screen.queryByText('likes 0')
    expect(element).toBeDefined()

    element = screen.queryByText('tester TheMan')
    expect(element).toBeDefined()
  })

  test('calls like function when button is pressed', async () => {
    const user = userEvent.setup()
    let button = screen.getByText('view')
    await user.click(button)

    button = screen.getByText('like')
    await user.click(button)
    expect(mockHandler.mock.calls).toHaveLength(1)
    await user.click(button)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})


describe('<BlogForm />', () => {
  
  const mockHandler = jest.fn()

  beforeEach(() => {
    render(<BlogForm createBlog={mockHandler}/>)
  })

  test('submits correct information on button click' , async () => {
    const user = userEvent.setup()
    let input = screen.getByPlaceholderText('write title here')
    await user.type(input, 'test title' )
    input = screen.getByPlaceholderText('write author here')
    await user.type(input, 'test author' )
    input = screen.getByPlaceholderText('write url here')
    await user.type(input, 'test url' )
    const sendButton = screen.getByText('create')
    await user.click(sendButton)
    
    expect(mockHandler.mock.calls).toHaveLength(1)
    const submittedBlog = mockHandler.mock.calls[0][0]
    expect(submittedBlog.title).toBe('test title')
    expect(submittedBlog.author).toBe('test author')
    expect(submittedBlog.url).toBe('test url')

  })
})