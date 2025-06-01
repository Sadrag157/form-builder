export function asyncFilter(array, asyncPredicate) {
    return Promise.all(
        array.map(async (item, index) => {
            return await asyncPredicate(item, index, array);
        })
    ).then(results => array.filter((_, i) => results[i]));
}