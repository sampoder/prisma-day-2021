# Prisma, Next.js & ISR: Building Speedy Web Apps

> Static Site Generation & Server Side Rendering each have an extensive list of benefits, what if we could combine them? Meet Incremental Static Regeneration and Next.js. In this talk we'll go over what ISR is, the benefits of ISR and how we can use Next.js' ISR with Prisma as well as why we should use it with Prisma. Best of all, we'll be exploring a practical application of Next.js, ISR & Prisma. After this lightning talk, your web pages will be faster than the speed of light.

I gave this talk at [Prisma Day 2021](https://www.prisma.io/day), the recording is coming soon.

Some handy code samples are:

```javascript
export async function getStaticPaths() {
  const { getUsers } = require('./api/users')
  let users = await getUsers(300)
  let paths = users.map(user => ({
    params: { username: user.name },
  }))
  return { paths, fallback: true }
}
```

```javascript
export async function getStaticProps({ params }) {
  const { getRedemptions } = require(‘./api/[username]’)
  let initalRedemptions = await getRedemptions(params.username)
  return { 
    props: { initalRedemptions, username: params.username }, 
    revalidate: 30 
  }
}
```

![Prisma Day 21 Icon](https://www.prisma.io/images/day2021/logo-big.svg)
