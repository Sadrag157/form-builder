export function loadFormStructure(savedFormString) {
    const data = JSON.parse(savedFormString);
    console.log('Loaded form structure:', data);
    return data;
}
