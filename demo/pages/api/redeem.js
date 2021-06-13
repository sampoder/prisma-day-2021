import prisma from '../../lib/prisma'
import { getSession } from 'next-auth/client'

export default async function RedeemCode(req, res) {
  const session = await getSession({ req })
  console.log(session)
  if (session) {
    let intendedSticker = await prisma.stickers.findMany({
      where: {
        code: req.query.code,
      },
      select: {
        id: true,
      },
    })
    console.log(intendedSticker)
    if (intendedSticker.length == 0) {
      res.status(504)
      res.send({ error: 'Code Not Found' })
    } else {
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
      const redemption = await prisma.redemptions.create({
        data: {
          stickerId: intendedSticker[0].id,
          userId: authedUserId,
        },
      })
      let allRedemptions = await prisma.redemptions.findMany({
        where: {
          userId: authedUserId,
        },
        select: {
          id: true,
          Stickers: {
            select: { nickname: true, imageurl: true, infourl: true },
          },
        },
        distinct: ['stickerId']
      })
      allRedemptions = allRedemptions.map(x => x.Stickers)
      res.send(allRedemptions)
    }
  } else {
    res.status(401)
    res.send({ error: 'Not Authenticated' })
  }
}
