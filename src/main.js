import { devmod } from './devmod'
import { sendRolesMessage } from './processes/sendRolesMessage'

if (process.argv.indexOf('--roles') !== -1) {
  sendRolesMessage()
} else {
  devmod()
}
