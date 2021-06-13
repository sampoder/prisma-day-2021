import prisma from '../../lib/prisma'
import { getSession } from 'next-auth/client'

export default async function Create(req, res) {
  const session = await getSession({ req })
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
    if (authedUserId == 'ckpgk77bb0008lvll76d6ven5') {
      const sticker = await prisma.stickers.create({
        data: {
          code: req.query.code,
          nickname: req.query.nickname,
          imageurl: req.query.imageurl,
          infourl: req.query.infourl,
          approved: true,
          submitteremail: 'sam@sampoder.com'
        },
      })
      res.send('Done!')
    } else {
      res.status(401)
      res.send({ error: 'Not Authenticated' })
    }
  }
}
