import { Notify } from 'quasar'

export class NotifyService {
  static create({
    position = 'top-right',
    type,
    message,
    html,
    group,
    actions = [{ icon: 'close', round: true }],
  }) {
    Notify.create({
      position,
      type,
      message,
      html,
      group,
      actions,
    })
  }
}
