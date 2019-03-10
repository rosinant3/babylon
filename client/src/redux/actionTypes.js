/*
 * action types
 */

export default function login(info2) {
    return { type: 'LOGIN_ACTION', login: { email: info2.email, 
                                            username: info2.username,
                                            verified: false,}}
  }