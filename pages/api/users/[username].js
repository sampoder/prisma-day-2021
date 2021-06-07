import prisma from '../../lib/prisma'
import { getSession } from 'next-auth/client'

function getRandomNum(min, max) {
  return Math.random() * (max - min) + min
}

export async function getRedemptions(username) {
  let allRedemptions = await prisma.user.findMany({
    where: {
      name: username,
    },
    select: {
      Redemptions: {
        select: {
          id: true,
          Stickers: {
            select: { nickname: true, imageurl: true, infourl: true },
          },
        },
        distinct: ['stickerId'],
      },
    },
  })
  allRedemptions = allRedemptions[0].Redemptions.map(x => ({
    number: getRandomNum(-30, 30),
    ...x.Stickers,
  }))
  return allRedemptions
}

export default async function RedeemCodeReq(req, res) {
  let data = await getRedemptions(req.query.username)
  res.send(data)
}
