import { Skeleton, Stack } from '@mui/material'
import React from 'react'

const ChatLoading = () => {
  return (
    <Stack spacing={-4}>
      <Skeleton animation="wave" height={110} />
      <Skeleton animation="wave" height={110} />
      <Skeleton animation="wave" height={110} />
      <Skeleton animation="wave" height={110} />
      <Skeleton animation="wave" height={110} />
    </Stack>
  )
}

export default ChatLoading
