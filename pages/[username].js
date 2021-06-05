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
import { useRouter } from 'next/router'

function getRandomNum(min, max) {
  return Math.random() * (max - min) + min
}

export default function Page({ preloadSession, initalRedemptions, username }) {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR(`/api/${username}`, fetcher, {
    initialData: initalRedemptions,
  })
  const redemptions = typeof data != 'undefined' ? data : initalRedemptions

  return (
    <>
      <Grid
        columns={[6, 8]}
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
          <A href={x.infourl} sx={{ display: 'flex', alignItems: 'center' }}>
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
      <Box
        sx={{
          position: 'fixed',
          bottom: 10,
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box bg="sunken" p={3} sx={{ borderRadius: 9 }}>
          <Flex sx={{ alignItems: 'center'}}>
            <Image
              src={`https://github.com/${username}.png`}
              sx={{ borderRadius: 9, height: '64px', mr: 3 }}
            />
            <Box>
              <Heading sx={{ fontWeight: 800 }}>@{username}</Heading>
              <Box>{redemptions.length} Stickers Redeemed</Box>
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  )
}

export async function getStaticPaths(context) {
  const { orderBy } = require('lodash')
  let users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      Redemptions: {
        select: { id: true },
      },
    },
  })
  users = users.map((x, index) => ({
    length: x.Redemptions.length,
    ...x,
  }))
  users = orderBy(users, 'length', 'desc')
  let paths = users.map((x, index) =>
    index < 300
      ? {
          params: { username: x.name },
        }
      : null,
  )
  console.log({ paths, fallback: true })
  return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
  const { getRedemptions } = require('./api/[username]')
  let initalRedemptions = await getRedemptions(params.username)
  initalRedemptions = initalRedemptions.map(x => ({
    number: getRandomNum(-30, 30),
    ...x,
  }))
  return {
    props: { initalRedemptions, username: params.username },
    revalidate: 30,
  }
}
