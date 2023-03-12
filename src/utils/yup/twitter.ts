import * as Yup from 'yup'

// https://help.twitter.com/en/managing-your-account/twitter-username-rules#:~:text=Your%20username%20cannot%20be%20longer,of%20underscores%2C%20as%20noted%20above.
export const YUP_TWITTER = Yup.lazy(value =>
  !value
    ? Yup.string()
    : Yup.string()
        .matches(/^[a-zA-z0-9_]{1,15}$/, {
          message: 'Invalid Twitter handle',
        })
        .min(4, 'Invalid Twitter handle')
        .max(15, 'Invalid Twitter handle'),
)
