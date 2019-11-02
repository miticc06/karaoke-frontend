import React from 'react'
import { notification } from 'antd'
import uuid from 'uuid/v4'

export class Notify {
  constructor (type, content, duration = 3) {
    this.key = uuid()
    this.duration = duration
    notification.config({
      placement: 'bottomLeft'
    })
    switch (type) {
      case 'error': {
        notification.error({
          message: 'Error',
          description: content,
          duration
        })
        break
      }
      case 'success': {
        notification.success({
          message: 'Success',
          description: content,
          duration
        })
        break
      }

      case 'info': {
        notification.info({
          message: 'Info',
          description: content,
          duration
        })
        break
      }

      // eslint-disable-next-line no-empty
      default: {
      }
    }
  }

  close () {
    notification.close(this.key)
  }

  success (content) {
    notification.success({
      key: this.key,
      message: <span>{content}</span>,
      duration: this.duration
    })
  }

  fail (content) {
    notification.error({
      key: this.key,
      message: <span>{content}</span>,
      duration: this.duration
    })
  }
}