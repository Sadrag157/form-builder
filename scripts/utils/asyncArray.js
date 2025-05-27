export function asyncFilter(array, asyncPredicate, signal) {
    return Promise.all(
        array.map(async (item, index) => {
            if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
            return await asyncPredicate(item, index, array);
        })
    ).then(results => array.filter((_, i) => results[i]));
}