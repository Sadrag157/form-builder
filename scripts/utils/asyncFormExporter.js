export async function* asyncFormFieldIterator(fields) {
    for (const field of fields) {
        await new Promise(resolve => setTimeout(resolve, 10));
        yield JSON.stringify(field);
    }
}

export async function exportFormAsync(fields, onChunk) {
    let result = '[';
    let first = true;

    for await (const chunk of asyncFormFieldIterator(fields)) {
        if (!first) result += ',';
        result += chunk;
        first = false;
        if (onChunk) onChunk(chunk);
    }

    result += ']';
    return result;
}