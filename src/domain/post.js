export const POST_TYPE = /** @type {const} */ ({
  QUESTION: 'QUESTION',
  NOTICE: 'NOTICE',
})

/** @typedef {typeof POST_TYPE[keyof typeof POST_TYPE]} PostType */

/**
 * 게시글 첨부파일. download_url은 서버가 응답에 포함하는 조회용 URL입니다.
 * @typedef {object} PostAttachment
 * @property {string} attachment_id
 * @property {string} original_name
 * @property {string} mime_type
 * @property {string} download_url
 */

/**
 * @typedef {object} Post
 * @property {string} post_id
 * @property {PostType} post_type
 * @property {string} title
 * @property {string} body
 * @property {string} author_display_name
 * @property {boolean} is_anonymous
 * @property {boolean} is_faq
 * @property {string | null} answer_body
 * @property {string | null} answered_at
 * @property {string} created_at
 * @property {PostAttachment[]} attachments
 */
