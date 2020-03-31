import {ParameterizedFilter} from './parameterized_filter_parsing'
import {ParameterlessFilter} from './parameterless_filter_parsing'

export type Filter = ParameterlessFilter|ParameterizedFilter