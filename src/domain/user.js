export const ROLE = /** @type {const} */ ({
  STUDENT: 'STUDENT',
})

/** @typedef {typeof ROLE[keyof typeof ROLE]} Role */

/**
 * 로그인 사용자 응답.
 * @typedef {object} User
 * @property {string} user_id
 * @property {string | null} student_no
 * @property {string} display_name
 * @property {Role} role
 * @property {boolean} push_enabled
 */
