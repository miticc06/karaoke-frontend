import React from 'react'
import { notification } from 'antd'
import uuid from 'uuid/v4'

export class Notify {
  constructor (type, content) {
    this.key = uuid()
    this.duration = 1.4
    notification.config({
      placement: 'bottomLeft'
    })
    switch (type) {
      case 'error': {
        notification.error({
          message: 'Error',
          description: content
        })
        break
      }
      case 'success': {
        notification.success({
          message: 'Success',
          description: content
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