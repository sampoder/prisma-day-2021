import prisma from '../lib/prisma'
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
} from 'theme-ui'
import Icon from 'supercons'

export default function Page({ preloadSession }) {
  const [sessionHook, loading] = useSession()

  const session = !sessionHook && preloadSession ? preloadSession : sessionHook

  return (
    <>
      {!session && (
        <>
          <Grid columns={2} sx={{ minHeight: '100vh' }}>
            <Box
              bg="sunken"
              sx={{
                minHeight: '100vh',
                px: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box>
                <Heading as="h1" sx={{ fontSize: '4em' }}>
                  <Text sx={{ fontWeight: '600' }}>Build Your</Text> <br />{' '}
                  Virtual Sticker Wall
                </Heading>
                <Box sx={{ my: 3 }}>
                  Enjoy attending hackathons, conferences and other events? Why
                  not build up a collection of virtual stickers from these
                  events? Your Virtual Sticker Wall serves as a collection of
                  great memories from these events.
                </Box>
                <Button onClick={() => signIn('github')} sx={{ pt: '5px' }}>
                  <Icon
                    glyph="github"
                    size={24}
                    style={{ marginRight: '0px' }}
                  />{' '}
                  <Text
                    sx={{
                      display: 'inline-block',
                      height: '24px',
                      verticalAlign: 'bottom',
                    }}
                  >
                    Sign in with GitHub
                  </Text>
                </Button>
              </Box>
            </Box>
          </Grid>
        </>
      )}
      {session && (
        <>
          <Grid columns={2} sx={{ minHeight: '100vh' }}>
            <Box
              bg="sunken"
              sx={{
                minHeight: '100vh',
                px: 4,
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Flex
                  sx={{
                    alignItems: 'center',
                    height: '48px',
                    mt: '24px',
                    bg: 'placeholder',
                    borderRadius: '999px',
                    width: 'fit-content',
                    pr: 3,
                  }}
                >
                  <Box
                    sx={{ height: '48px', width: '48px', position: 'relative' }}
                  >
                    <Image
                      src={session.user.image}
                      sx={{
                        height: '48px',
                        borderRadius: '999px',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                    />
                    <Box
                      sx={{
                        height: '48px',
                        width: '48px',
                        position: 'absolute',
                        borderRadius: '999px',
                        top: 0,
                        left: 0,
                        bg: 'background',
                        display: 'flex',
                        opacity: 0,
                        cursor: 'pointer',
                        ':focus,:hover': {
                          opacity: 0.8,
                          transform: 'scale(1.01)',
                        },
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onClick={() => signOut()}
                    >
                      <Icon
                        glyph="door-leave"
                        style={{ transform: 'rotate(180deg)' }}
                      />
                    </Box>
                  </Box>
                  <Heading sx={{ fontWeight: '500', ml: '8px' }}>
                    @sampoder
                  </Heading>
                </Flex>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: 'calc(100vh - 144px)',
                    width: '100%',
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Card sx={{ p: [3, 3], my: 3 }}>
                      Welcome to your dashboard! Here you can redeem sticker
                      codes and check out all of your redeemed stickers.
                    </Card>
                    <Card sx={{ p: [3, 3], my: 3 }}>
                      <Input sx={{ bg: 'sunken', borderRadius: '6px' }} />
                      <Button sx={{ width: '100%', mt: 3 }}>
                        Redeem Sticker Code
                      </Button>
                    </Card>
                    <Card sx={{ p: [3, 3] }}>
                      <Input
                        as="div"
                        sx={{
                          bg: 'sunken',
                          borderRadius: '6px',
                          color: 'grey',
                        }}
                      >
                        https://avatars.githubusercontent.com/u/39828164?v=4
                      </Input>
                      <Grid columns="3fr 0.33fr 0.33fr">
                        <Button sx={{ width: '100%', mt: 3 }}>Copy URL</Button>
                        <Button sx={{ width: '100%', mt: 3 }}>
                          <Icon
                            glyph="twitter-fill"
                            size={28}
                            style={{ marginRight: '0px', marginLeft: '-4px' }}
                          />
                        </Button>
                        <Button sx={{ width: '100%', mt: 3 }}>
                          {' '}
                          <Icon
                            glyph="facebook-fill"
                            size={28}
                            style={{ marginRight: '0px', marginLeft: '-4px' }}
                          />
                        </Button>
                      </Grid>
                    </Card>
                  </Box>
                </Box>
                <Flex
                  sx={{
                    alignItems: 'center',
                    height: '48px',
                    mb: '24px',
                    color: 'grey',
                  }}
                >
                  Built by Sam Poder, open sourced here.
                </Flex>
              </Box>
            </Box>
          </Grid>
        </>
      )}
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  console.log(session)
  if (session) {
    let authedUserId = (
      await prisma.session.findMany({
        where: {
          accessToken: session.accessToken,
        },
        select: {
          userId: true,
        },
      })
    )[0].userId
    let allRedemptions = await prisma.redemptions.findMany({
      where: {
        userId: authedUserId,
      },
      select: {
        id: true,
        Stickers: { select: { nickname: true, imageurl: true, infourl: true } },
      },
    })
    allRedemptions = allRedemptions.map(x => x.Stickers)
    return { props: { redemptions: allRedemptions, preloadSession: session } }
  } else {
    return { props: {} }
  }
}
