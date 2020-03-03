export default function computeTableAliases(parameterNames) {
    return parameterNames.reduce((dictionary, param, index) => {
        dictionary[param] = 't' + (index + 1)

        return dictionary
    }, {})
}