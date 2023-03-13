export const createNotification = (content) => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: { message: content.message, type: content.type },
    })
    setTimeout(() => {
      dispatch({
        type: 'CLEAR_NOTIFICATION',
      })
    }, 5000)
  }
}

export const deleteNotification = () => {
  return {
    type: 'CLEAR_NOTIFICATION',
  }
}

const notificationReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data
    case 'CLEAR_NOTIFICATION':
      return ''
    default:
      return state
  }
}

export default notificationReducer
