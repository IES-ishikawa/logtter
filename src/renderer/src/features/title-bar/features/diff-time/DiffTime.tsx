import { Box, FormLabel } from '@mui/material'
import { useAppStore } from '@renderer/store'

export function DiffTime(): JSX.Element {
  const diffTime = useAppStore((state) => state.diffTime)
  return (
    <>
      {diffTime && (
        <Box display={'flex'} alignItems={'center'} mr={3}>
          <FormLabel>{diffTime}</FormLabel>
        </Box>
      )}
    </>
  )
}
