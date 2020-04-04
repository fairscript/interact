import * as A from 'arcsecond'

export const theFalse = A.str('false').map(() => false)
export const theTrue = A.str('true').map(() => true)
export const aBoolean = A.choice([theFalse, theTrue])