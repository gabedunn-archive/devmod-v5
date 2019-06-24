import { setSetting, getSetting } from '../db'

const test = async () => {
  // await setSetting('test', 'hey you')

  const val = await getSetting('test')

  console.log(val)
}

test()
