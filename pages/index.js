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
  Link as A,
} from 'theme-ui'
import Icon from 'supercons'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ColourSwitcher from '../components/color-switcher'
import { useState } from 'react'
import useSWR, { mutate } from 'swr'

function getRandomNum(min, max) {
  return Math.random() * (max - min) + min;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default function Page({ preloadSession, initalRedemptions }) {
  const [sessionHook, loading] = useSession()
  const session = !sessionHook && preloadSession ? preloadSession : sessionHook
  if (!session) {
    return (
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
                not build up a collection of virtual stickers from these events?
                Your Virtual Sticker Wall serves as a collection of great
                memories from these events.
              </Box>
              <Button onClick={() => signIn('github')} sx={{ pt: '5px' }}>
                <Icon glyph="github" size={24} style={{ marginRight: '0px' }} />{' '}
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
    )
  }
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR(`/api/${session.user.name}`, fetcher, {
    initialData: initalRedemptions,
  })
  const [status, setStatus] = useState('no-entry')
  const [code, setCode] = useState('')
  const redemptions = typeof data != 'undefined' ? data : initalRedemptions
  async function submit() {
    if (code != '') {
      setStatus('loading')
      let res = await fetch(`api/redeem?code=${code}`).then(r => r.json())
      setStatus('success')
      mutate(`/api/${session.user.name}`)
      if (res.error) {
        alert(`Error: ${res.error}`)
      }
      await sleep(2000)
      setStatus('no-entry')
    } else {
      alert('Please fill out all fields.')
    }
  }
  return (
    <>
      {session && (
        <>
          <Grid
            columns={[1, 2, 2]}
            sx={{ maxHeight: [null, '100vh'], overflowY: 'scroll' }}
          >
            <Box
              bg="sunken"
              sx={{
                maxHeight: ['50vh', '100vh'],
                overflow: 'scroll',
                px: 4,
                gridRow: [2, 1],
                boxShadow: ['elevated', 'none'],
                borderTop: 'solid',
                borderTopWidth: '16px',
                borderTopColor: 'sunken',
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Box sx={{ position: 'relative', display: ['none', 'block'] }}>
                  <ColourSwitcher />
                  <Flex
                    sx={{
                      alignItems: 'center',
                      height: '36px',
                      mt: '24px',
                      bg: 'background',
                      borderRadius: '999px',
                      width: 'fit-content',
                      pr: 3,
                    }}
                  >
                    <Box
                      sx={{
                        height: '36px',
                        width: '36px',
                        position: 'relative',
                      }}
                    >
                      <Image
                        src={session.user.image}
                        sx={{
                          height: '36px',
                          borderRadius: '999px',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                        }}
                      />
                      <Box
                        sx={{
                          height: '36px',
                          width: '36px',
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
                    <Heading
                      sx={{ fontWeight: '500', ml: '8px', fontSize: '1.1em' }}
                    >
                      @{session.user.name}
                    </Heading>
                  </Flex>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: [null, 'calc(100vh - 144px)'],
                    width: '100%',
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Card sx={{ p: [3, 3], my: 3, mt: [0, 3] }}>
                      Welcome to your dashboard! Here you can redeem sticker
                      codes and check out all of your redeemed stickers.
                    </Card>
                    <Card sx={{ p: [3, 3], my: 3 }}>
                      <Input
                        sx={{ bg: 'sunken', borderRadius: '6px' }}
                        onInput={e => setCode(e.target.value)}
                        value={code}
                        placeholder="4 to 6 Alphanumeric Code"
                      />
                      <Button
                        sx={{ width: '100%', mt: 3 }}
                        onClick={() => submit()}
                      >
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
                          overflow: 'hidden',
                        }}
                      >
                        https://stickerwall.vercel.app/{session.user.name}
                      </Input>
                      <Grid columns={[1, '3fr 3fr']} gap={[0, 2]}>
                        <CopyToClipboard
                          text={`https://stickerwall.vercel.app/${session.user.name}`}
                        >
                          <Button sx={{ width: '100%', mt: 3 }}>
                            Copy URL
                          </Button>
                        </CopyToClipboard>
                        <Button
                          sx={{ width: '100%', mt: 3, pt: '5.2px' }}
                          as="a"
                          href={`https://twitter.com/intent/tweet?text=https://stickerwall.vercel.app/${session.user.name}`}
                        >
                          <Icon
                            glyph="twitter-fill"
                            size={24}
                            style={{
                              marginRight: '0px',
                              transform: 'translateY(1px)',
                            }}
                          />{' '}
                          <Text
                            sx={{
                              display: 'inline-block',
                              height: '24px',
                              verticalAlign: 'bottom',
                            }}
                          >
                            Share on Twitter
                          </Text>
                        </Button>
                      </Grid>
                    </Card>
                  </Box>
                </Box>
                <Flex
                  sx={{
                    alignItems: 'center',
                    mt: 2,
                    mb: '24px',
                    color: 'grey',
                    textAlign: ['center', 'left'],
                  }}
                >
                  <p style={{ width: '100%' }}>
                    Built by Sam Poder for Prisma Day 2021, open sourced here.
                  </p>
                </Flex>
              </Box>
            </Box>
            <Grid
              columns={[3, 4]}
              p={4}
              gap={4}
              sx={{
                gridTemplateRows: 'max-content',
                maxHeight: '100vh',
                minHeight: '50vh',
                overflowY: 'scroll',
              }}
            >
              {redemptions.map((x, index) => (
                <A href={x.infourl} sx={{ display: 'flex', alignItems: 'center'}}>
                  <Image
                    src={x.imageurl}
                    sx={{
                      transition:
                        'transform .125s ease-in-out, box-shadow .125s ease-in-out',
                        transform: `rotate(${initalRedemptions[index].number}deg)`,
                      ':focus,:hover': {
                        transform: 'scale(1.0625)',
                      },
                    }}
                  />
                </A>
              ))}
            </Grid>
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
      distinct: ['stickerId'],
    })
    allRedemptions = allRedemptions.map(x => ({number: getRandomNum(-30, 30), ...x.Stickers}))
    return {
      props: { initalRedemptions: allRedemptions, preloadSession: session },
    }
  } else {
    return { props: {} }
  }
}
