import { useNotificationValue, useNotificationDispatch } from "../NotificationContext"

const Notification = () => {
  const value = useNotificationValue()
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  const dispatch = useNotificationDispatch()
  
  if (!value) return null
  else setTimeout(() => {
    dispatch({type: "CLEAR"})
  }, 5000)
  return (
    <div style={style}>
      {value}
    </div>
  )
}

export default Notification