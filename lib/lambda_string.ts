function getFunctionBodyAsString(f: Function): string {
    const functionString = f.toString()

    return functionString.substring(
        functionString.indexOf("{") + 1,
        functionString.lastIndexOf("}")
    )
}

function removeReturnStatement(body: string): string {
    return body.substring(
        body.indexOf('return') + 6 + 1,
        body.length
    )
}

function removeSemicolon(body: string): string {
    if (body.endsWith(';')) {
        return body.substr(0, body.length - 1)
    } else {
        return body
    }
}

export function extractLambdaString(f: Function) {
    const functionBody = getFunctionBodyAsString(f).trim()
    const withoutReturnStatement = removeReturnStatement(functionBody).trim()
    return removeSemicolon(withoutReturnStatement)
}