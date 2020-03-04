export default function normalizeQuotes(unnormalized: string): string {
    let normalized = ''

    let insideString = null

    for (let i = 0; i < unnormalized.length; i++) {
        let character = unnormalized.charAt(i)

        if(character === "'" || character === '"') {
            // String begins
            if (insideString === null) {
                insideString = character
                normalized += "'"
            }
            // String ends
            else if (character == insideString) {
                insideString = null
                normalized += "'"
            }
            else {
                normalized += character
            }
        }
        else {
            normalized += character
        }

    }

    return normalized
}