import prisma from '../../lib/prisma'
import { getSession } from 'next-auth/client'

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
    ...x.Stickers,
  }))
  return allRedemptions
}

export default async function RedeemCodeReq(req, res) {
  let data = await getRedemptions(req.query.username)
  res.send(data)
}
