import prisma from '../../lib/prisma'
import { getSession } from 'next-auth/client'

function getRandomNum(min, max) {
  return Math.random() * (max - min) + min
}

export async function getUsers(max) {
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
  users = users.map((x, index) =>
    (typeof max != 'undefined' ? index < max : true) ? x : null,
  )
  return users
}

export default async function RedeemCodeReq(req, res) {
  let data = await getUsers()
  res.send(data)
}
