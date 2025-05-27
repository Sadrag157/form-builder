export function loadFormStructure(exportedForm) {
    const data = JSON.parse(exportedForm);
    console.log('Loaded form structure:', data);
    return data;
}
