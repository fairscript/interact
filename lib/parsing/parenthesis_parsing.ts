import * as parenthesis from 'parenthesis'

export function escapeParenthesesInsideStrings(lambdaString: string): [number[], string] {
    const positions = []
    let escapedString = ''

    let i = 0

    let insideString = false
    let isEscaped = false

    while (i < lambdaString.length) {
        // Get current character
        const character = lambdaString.charAt(i)

        // Is the current character inside a string?
        // Is it a parenthesis?
        if (insideString && (character === '(' || character === ')')) {
            positions.push(i)
            if(character === '(') {
                escapedString += 'O'
            }
            else {
                escapedString += 'C'
            }
        }
        else {
            escapedString += character
        }

        // Toggle inSideString if the current character is an unescaped apostrophe
        if (!isEscaped && character === '\'') {
            insideString = !insideString
        }

        // Turn off escape mode if it was turned on
        if (isEscaped) {
            isEscaped = false
        }
        // Turn on escape mode if it was turned off and the current character is a slash
        else if (!isEscaped && character === '\\') {
            isEscaped = true
        }

        // Move to the next position
        i++
    }

    return [positions, escapedString]
}

export function unescapeParenthesesInsideStrings(segment: NestedSegment, parentheses: number[], startPosition: number = 0): NestedSegment {
    let currentPosition = startPosition

    return segment.map(item => {

        if (Array.isArray(item)) {
            return unescapeParenthesesInsideStrings(item, parentheses, currentPosition)
        }
        else {
            const escaped = item as string
            let segmentLength = escaped.length

            let unescaped = ''
            let indexWithinSegment = 0
            while (indexWithinSegment < segmentLength) {
                const character = escaped.charAt(indexWithinSegment)

                if (parentheses.includes(startPosition + indexWithinSegment)) {
                    if (character == 'O') {
                        unescaped += '('
                    } else {
                        unescaped += ')'
                    }
                } else {
                    unescaped += character
                }

                indexWithinSegment++
            }

            return unescaped
        }
    })
}

export interface NestedSegment extends Array<NestedSegment | string> {}

export function parseParentheses(input: string): Array<NestedSegment> {
    return parenthesis(input, {
            brackets: ['()'],
            escape: '\\',
            flat: false
        }
    )
}