import { signIn, signOut, useSession, getSession } from 'next-auth/client'
import {
  Button,
  Box,
  Grid,
  Heading,
  Text,
  Image,
  Flex,
  Card,
  Input,
  Link as A,
} from 'theme-ui'


export default function Page() {
  const [sessionHook, loading] = useSession()
  const session = sessionHook
  return (
    <>
      <>
        <Box
          bg="sunken"
          sx={{
            overflow: 'scroll',
            px: 4,
            gridRow: [2, 1],
            boxShadow: ['elevated', 'none'],
            minHeight: '100vh',
          }}
        >
          <Box sx={{ width: '100%', minHeight: '100vh' }}>
            {' '}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',

                minHeight: '100vh',
                width: '100%',
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Card sx={{ p: [3, 3], my: 3, mt: [0, 3] }}>
                  This only open to admins. Please email sam@sampoder.com to
                  submit your own stickers.
                </Card>
                <Card sx={{ p: [3, 3], my: 3 }}>
                  <form action="/api/create">
                    <Input
                      sx={{ bg: 'sunken', borderRadius: '6px' }}
                      placeholder="4 to 6 Alphanumeric Code"
                      name="code"
                    />
                    <Input
                      sx={{ bg: 'sunken', borderRadius: '6px', mt: 3 }}
                      placeholder="Nickname"
                      name="nickname"
                    />
                    <Input
                      sx={{ bg: 'sunken', borderRadius: '6px', mt: 3 }}
                      placeholder="Image URL"
                      name="imageurl"
                    />
                    <Input
                      sx={{ bg: 'sunken', borderRadius: '6px', mt: 3 }}
                      placeholder="Info URL"
                      name="infourl"
                    />
                    <Button
                      as="input"
                      type="submit"
                      sx={{ width: '100%', mt: 3 }}
                      value="Redeem Sticker Code"
                    />
                  </form>
                </Card>{' '}
              </Box>
            </Box>
          </Box>
        </Box>
      </>
    </>
  )
}
